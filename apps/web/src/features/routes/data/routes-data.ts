export const routesSummary = [
  { label: "Total Stops", value: "12", trend: "+2 vs yesterday" },
  { label: "Est. Time", value: "4h 30m", trend: "Optimized" },
];

export const todayRoutes = [
  {
    group: "METROPOLITAN",
    visits: 4,
    items: [
      {
        id: "1",
        title: "Starlight Apartments",
        subtitle: "Unit 402 - Signal Degradation",
        time: "09:15 AM",
        priority: "HIGH",
        status: "ACTIVE",
        statusColor: "emerald"
      },
      {
        id: "2",
        title: "Apex Financial Hub",
        subtitle: "Server Room 2 - Expansion",
        time: "10:45 AM",
        priority: "MED",
        status: "PENDING",
        statusColor: "indigo"
      }
    ]
  },
  {
    group: "SUBURBAN EAST",
    visits: 2,
    items: [
      {
        id: "3",
        title: "Miller Residence",
        subtitle: "Cable Cut - Outage",
        time: "01:30 PM",
        priority: "CRITICAL",
        status: "URGENT",
        statusColor: "rose"
      }
    ]
  }
];

export const mapMarkers = [
  { id: "1", x: 70, y: 30, label: "1" },
  { id: "2", x: 85, y: 60, label: "2" },
  { id: "H", x: 45, y: 55, label: "H" },
];
