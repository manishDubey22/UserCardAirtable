import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import upwordArrow from "./assets/upwordArrow.svg";
import Card from "./components/card";
import NoDataFound from "./components/noDataFound";
import Loading from "./components/loading";
import SortingData from "./components/sorting";
import { logUserData } from "./utils/logUsers/logUsers";
import { handleRevenueData } from "./utils/logUsers";
import "./App.css";

function App() {
  const maxRecords = 83;
  const apiKey = "Bearer key4v56MUqVr9sNJv";
  const [apiUrl, setApiUrl] = useState(
    `https://api.airtable.com/v0/appBTaX8XIvvr6zEC/Users?maxRecords=${maxRecords}&view=Grid%20view`
  );
  const [userData, setUserData] = useState<any[]>([]);
  const [apiLoading, setApiLoading] = useState(true);
  const [logData, setLogData] = useState<any[]>([]);
  const [matchedDataSet, setMatchedDataSet] = useState<any[]>([]);
  const [apiErrorCheck, setApiErrorCheck] = useState(false);

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
          setUserData(data?.records);
          setLogData(logUserData);
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
      const matchedData = handleRevenueData({ logData, userData });
      setMatchedDataSet(matchedData);
      setApiLoading(false);
    }
  }, [userData, logData]);

  return (
    <div className="body">
      <header id="topHead">
        <figure>
          <img src={reactLogo} className="logo react" alt="React logo" />
        </figure>
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
                <div
                  className="cards-container"
                  key={user?.id}
                  data-testid="card-component"
                >
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
      <footer>
        <div className="floating-arrow">
          <a href="#topHead">
            <img src={upwordArrow} alt="Go to top" />
          </a>
        </div>
      </footer>
    </div>
  );
}

export default App;
