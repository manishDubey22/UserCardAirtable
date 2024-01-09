import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import Card from "./components/card";
import NoDataFound from "./components/noDataFound";
import Loading from "./components/loading";
import SortingData from "./components/sorting";
import "./App.css";

function App() {
  const maxRecords = 83;
  const apiKey = "Bearer key4v56MUqVr9sNJv";
  const [apiUrl, setApiUrl] = useState(
    `https://api.airtable.com/v0/appBTaX8XIvvr6zEC/Users?maxRecords=${maxRecords}&view=Grid%20view`
  );
  const [userData, setUserData] = useState([]);
  const [apiLoading, setApiLoading] = useState(true);
  const [logData, setLogData] = useState([]);
  const [matchedDataSet, setMatchedDataSet] = useState<any[]>([]);
  const [apiErrorCheck, setApiErrorCheck] = useState(false);

  const handleRevenueData = (data: any) => {
    let matchedDataCollection: any[] = [];
    userData?.forEach((user: any) => {
      let userImpressionsCount = 0;
      let userConversionsCount = 0;
      let totalRevenue = 0;
      let counts: any = {};
      let sortedChartData: any = [];

      data?.map((log: any) => {
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

      // Transform counts into an array of objects for chart
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
    setMatchedDataSet(matchedDataCollection);
    setApiLoading(false);
  };

  const fetchLogData = async () => {
    try {
      const response = await fetch(
        "https://assets.interviewhelp.io/INTERVIEW_HELP/reactjs/logs.json"
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setLogData(data);
    } catch (error) {
      console.error("Could not fetch the data: ", error);
      setApiErrorCheck(true);
      setApiLoading(false);
    }
  };

  useEffect(() => {
    if (apiLoading && apiUrl) {
      //to initialize it again for the new data set
      setMatchedDataSet([]);
      setLogData([]);
      setUserData([]);

      fetch(apiUrl, {
        method: "GET",
        headers: {
          Authorization: apiKey,
        },
      })
        .then((response) => {
          if (!response.ok) {
            setApiLoading(false);
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          console.log("API Response Data:", data, typeof data, data?.records);
          setUserData(data?.records);

          fetchLogData();
        })
        .catch((error) => {
          console.error("Error:=>", error);
          setApiErrorCheck(true);
          setApiLoading(false);
        });
    }
  }, [apiUrl]);

  useEffect(() => {
    if (userData?.length && logData?.length) {
      handleRevenueData(logData);
    }
  }, [userData, logData]);

  return (
    <div className="body">
      <header>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
        <h2>User Data</h2>
      </header>

      <section>
        <SortingData
          maxRecords={maxRecords}
          setApiUrl={setApiUrl}
          setApiLoading={setApiLoading}
          matchedDataSet={matchedDataSet}
          setMatchedDataSet={setMatchedDataSet}
        />
      </section>

      <main>
        {apiLoading && <Loading />}
        {!apiLoading &&
        userData?.length &&
        logData?.length &&
        matchedDataSet?.length
          ? matchedDataSet?.map((user: any) => {
              return (
                <div className="cards-container" key={user?.id} data-testid="card-component">
                  <Card {...user} />
                </div>
              );
            })
          : !apiLoading &&
            userData?.length === 0 &&
            logData?.length === 0 &&
            matchedDataSet?.length === 0 && (
              <NoDataFound apiErrorCheck={apiErrorCheck} />
            )}
      </main>
      <footer></footer>
    </div>
  );
}

export default App;
