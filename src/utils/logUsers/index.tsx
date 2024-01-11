
interface handleRevenueDataProps {
    logData: any;
    userData: any;
}

export const handleRevenueData = ({logData, userData }: handleRevenueDataProps) => {
    let matchedDataCollection: any[] = [];
    userData?.forEach((user: any) => {
      let userImpressionsCount = 0;
      let userConversionsCount = 0;
      let totalRevenue = 0;
      let counts: any = {};
      let sortedChartData: any = [];

      logData?.map((log: any) => {
        if (log?.user_id === user?.fields?.Id) {
          if (log?.type?.toLowerCase() === "impression") {
            userImpressionsCount++;
          } else if (log?.type?.toLowerCase() === "conversion") {
            userConversionsCount++;
          }

          if (log.type?.toLowerCase() === "conversion") {
            const date = log.time.split(" ")[0]; // Extract date from time
            counts[date] = (counts[date] || 0) + 1;
          }

          totalRevenue += log?.revenue;
        }
      });

      // Transform counts into an array of objects to use it in rechart
      if (counts) {
        let chartData = Object.keys(counts).map((date) => {
          return {
            date: date,
            countNum: counts[date],
          };
        });

        sortedChartData = [...chartData].sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
      }

      matchedDataCollection.push({
        ...user,
        userImpressionsCount,
        userConversionsCount,
        totalRevenue,
        sortedChartData,
      });
    });

    return matchedDataCollection;
  };