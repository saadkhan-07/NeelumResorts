import { prisma } from "./db";

/**
 * Reads for the admin panel.
 *
 * Kept apart from `queries.ts` deliberately: those are wrapped in React `cache()`
 * and feed statically rendered public pages, while these must be fresh on every
 * request — the owner refreshing the dashboard wants today's enquiries, not a
 * cached count.
 *
 * They follow the same rule as the public queries: an empty table is a normal
 * result, and a failed query returns the empty result rather than taking the
 * screen down. The owner is on weak valley signal; a dropped connection should
 * cost them a number, not the whole panel.
 */

async function safe<T>(label: string, run: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await run();
  } catch (error) {
    console.error(`[admin-queries] ${label} failed:`, error);
    return fallback;
  }
}

/** The badge on the Enquiries tab. */
export function countNewEnquiries() {
  return safe(
    "countNewEnquiries",
    () => prisma.enquiry.count({ where: { status: "NEW" } }),
    0,
  );
}

export type DashboardStats = {
  newEnquiries: number;
  totalEnquiries: number;
  stayEnquiries: number;
  tourEnquiries: number;
  publishedRooms: number;
  publishedTours: number;
};

export function getDashboardStats(): Promise<DashboardStats> {
  return safe(
    "getDashboardStats",
    async () => {
      const [newEnquiries, totalEnquiries, stayEnquiries, tourEnquiries, publishedRooms, publishedTours] =
        await Promise.all([
          prisma.enquiry.count({ where: { status: "NEW" } }),
          prisma.enquiry.count(),
          prisma.enquiry.count({ where: { kind: "STAY" } }),
          prisma.enquiry.count({ where: { kind: "TOUR" } }),
          prisma.room.count({ where: { published: true } }),
          prisma.tour.count({ where: { published: true } }),
        ]);

      return {
        newEnquiries,
        totalEnquiries,
        stayEnquiries,
        tourEnquiries,
        publishedRooms,
        publishedTours,
      };
    },
    {
      newEnquiries: 0,
      totalEnquiries: 0,
      stayEnquiries: 0,
      tourEnquiries: 0,
      publishedRooms: 0,
      publishedTours: 0,
    },
  );
}

const enquiryCard = {
  room: { select: { name: true } },
  tour: { select: { name: true } },
} as const;

export type EnquiryCard = Awaited<ReturnType<typeof getRecentEnquiries>>[number];

/** The five most recent enquiries, whatever their status. */
export function getRecentEnquiries(take = 5) {
  return safe(
    "getRecentEnquiries",
    () =>
      prisma.enquiry.findMany({
        orderBy: { createdAt: "desc" },
        take,
        include: enquiryCard,
      }),
    [] as Awaited<ReturnType<typeof prisma.enquiry.findMany<{ include: typeof enquiryCard }>>>,
  );
}

/* ------------------------------------------------------- enquiries screen */

export type EnquiryFilter = {
  status?: "NEW" | "REPLIED" | "CLOSED";
  kind?: "STAY" | "TOUR";
};

/**
 * The enquiries list. Filtered by status and by kind, because stays and tours
 * are two different businesses with different lead times — the owner answering
 * a jeep enquiry is doing a different job from answering a room booking.
 */
export function getEnquiries(filter: EnquiryFilter = {}) {
  return safe(
    "getEnquiries",
    () =>
      prisma.enquiry.findMany({
        where: {
          ...(filter.status ? { status: filter.status } : {}),
          ...(filter.kind ? { kind: filter.kind } : {}),
        },
        orderBy: { createdAt: "desc" },
        take: 200,
        include: enquiryCard,
      }),
    [] as Awaited<ReturnType<typeof prisma.enquiry.findMany<{ include: typeof enquiryCard }>>>,
  );
}

export function getEnquiry(id: string) {
  return safe(
    `getEnquiry(${id})`,
    () => prisma.enquiry.findUnique({ where: { id }, include: enquiryCard }),
    null,
  );
}

/** Counts for the filter chips, so the owner sees where the work is. */
export function getEnquiryCounts() {
  return safe(
    "getEnquiryCounts",
    async () => {
      const [all, nw, replied, closed, stay, tour] = await Promise.all([
        prisma.enquiry.count(),
        prisma.enquiry.count({ where: { status: "NEW" } }),
        prisma.enquiry.count({ where: { status: "REPLIED" } }),
        prisma.enquiry.count({ where: { status: "CLOSED" } }),
        prisma.enquiry.count({ where: { kind: "STAY" } }),
        prisma.enquiry.count({ where: { kind: "TOUR" } }),
      ]);
      return { all, NEW: nw, REPLIED: replied, CLOSED: closed, STAY: stay, TOUR: tour };
    },
    { all: 0, NEW: 0, REPLIED: 0, CLOSED: 0, STAY: 0, TOUR: 0 },
  );
}
