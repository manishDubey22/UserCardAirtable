import "./index.css";
import viteLogo from "/vite.svg";

interface NoDataFoundProps {
  apiErrorCheck: boolean;
}

const NoDataFound = ({ apiErrorCheck }: NoDataFoundProps) => {
  return (
    <section className="noDataContainer">
      <img src={viteLogo} alt="Logo" className="logo" />
      <h1>No Data Found</h1>
      <p>Please try again.</p>
      {apiErrorCheck && <p>Something went wrong.</p>}
    </section>
  );
};

export default NoDataFound;
