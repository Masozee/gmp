import { NextRequest, NextResponse } from "next/server";
import sqlite from "@/lib/sqlite";
import { startOfDay, subDays } from "date-fns";
import { getServerSession } from "@/lib/server-auth";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get total counts
    const [
      totalUsers,
      totalPublications,
      totalEvents,
      totalProfiles,
      recentErrorLogs,
      publicationsByStatus,
      eventsByStatus,
      recentPublications,
      upcomingEvents
    ] = await Promise.all([
      sqlite.get(`SELECT COUNT(*) as count FROM user(),
      sqlite.get(`SELECT COUNT(*) as count FROM publication(),
      sqlite.get(`SELECT COUNT(*) as count FROM event(),
      sqlite.get(`SELECT COUNT(*) as count FROM profile(),
      sqlite.all(`SELECT * FROM errorLog({
        where: {
          createdAt: {
            gte: subDays(new Date(), 7)
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: 5
      }),
      prisma.publication.groupBy({
        by: ['status'],
        _count: true
      }),
      prisma.event.groupBy({
        by: ['status'],
        _count: true
      }),
      sqlite.all(`SELECT * FROM publication({
        orderBy: {
          createdAt: 'desc'
        },
        take: 5,
        include: {
          authors: {
            include: {
              profile: true
            }
          }
        }
      }),
      sqlite.all(`SELECT * FROM event({
        where: {
          startDate: {
            gte: new Date()
          }
        },
        orderBy: {
          startDate: 'asc'
        },
        take: 5,
        include: {
          category: true
        }
      })
    ]);

    // Calculate error rate
    const totalErrors = recentErrorLogs.length;
    const errorRate = totalErrors > 0 ? ((totalErrors / 7).toFixed(2)) : 0;

    return NextResponse.json({
      overview: {
        totalUsers,
        totalPublications,
        totalEvents,
        totalProfiles,
        errorRate
      },
      publicationStats: publicationsByStatus,
      eventStats: eventsByStatus,
      recentActivity: {
        publications: recentPublications,
        events: upcomingEvents,
        errorLogs: recentErrorLogs
      }
    });
  } catch (error) {
    console.error('Dashboard data fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
} 