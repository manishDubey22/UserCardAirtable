import { describe, expect, vi } from "vitest";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import SortingData from "./index";

beforeAll(() => {
  const script = document.createElement("script");
  document.body.appendChild(script);
});

describe("SortingData component", () => {
  const setApiUrl = vi.fn();
  const setApiLoading = vi.fn();
  const setMatchedDataSet = vi.fn();

  test("should render without an error", () => {
    expect(() => {
      render(
        <SortingData
          maxRecords={12}
          setApiUrl={setApiUrl}
          setApiLoading={setApiLoading}
          matchedDataSet={[]}
          setMatchedDataSet={setMatchedDataSet}
        />
      );
    }).not.toThrow();
  });

  test("calls setApiUrl with correct URL when a sort field is selected", async () => {
    render(
      <SortingData
        maxRecords={12}
        setApiUrl={setApiUrl}
        setApiLoading={setApiLoading}
        matchedDataSet={[]}
        setMatchedDataSet={setMatchedDataSet}
      />
    );

    expect(screen.getByTestId("sort-select-box")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("sort-select-box"));
    waitFor(() => {
      expect(screen.getByText(/name/i)).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText(/apply/i));
    waitFor(() => {
      expect(setApiUrl).toHaveBeenCalledWith(expect.stringContaining("Name"));
    });
  });

  test("changes sort direction correctly", async () => {
    render(
      <SortingData
        maxRecords={12}
        setApiUrl={setApiUrl}
        setApiLoading={setApiLoading}
        matchedDataSet={[]}
        setMatchedDataSet={setMatchedDataSet}
      />
    );

    const selectSortField = screen.getByLabelText(/sort/i);
    fireEvent.mouseDown(selectSortField);
    const option = screen.getByText(/revenue/i);
    fireEvent.click(option);

    const selectSortDirection = screen.getByLabelText(/without label/i);
    fireEvent.mouseDown(selectSortDirection);
    const direction = screen.getAllByText(/descending/i)[0];
    fireEvent.click(direction);

    const applyButton = screen.getByText(/apply/i);
    fireEvent.click(applyButton);

    waitFor(() => {
      expect(setApiUrl).toHaveBeenCalledWith(expect.stringContaining("desc"));
    });
  });

  test("sorts data based on selected field and direction", async () => {
    const mockSetMatchedDataSet = vi.fn();
    const mockData = [
      { userImpressionsCount: 5, userConversionsCount: 2, totalRevenue: 100 },
      { userImpressionsCount: 3, userConversionsCount: 4, totalRevenue: 200 },
    ];

    render(
      <SortingData
        maxRecords={100}
        setApiUrl={vi.fn()}
        setApiLoading={vi.fn()}
        matchedDataSet={mockData}
        setMatchedDataSet={mockSetMatchedDataSet}
      />
    );

    const selectSortField = screen.getByLabelText(/sort/i);
    fireEvent.mouseDown(selectSortField);
    const option = screen.getByText(/impressions/i);
    fireEvent.click(option);

    const selectSortDirection = screen.getByLabelText(/without label/i);
    fireEvent.mouseDown(selectSortDirection);
    const direction = screen.getAllByText(/ascending/i)[0];
    fireEvent.click(direction);

    const applyButton = screen.getByText(/apply/i);
    fireEvent.click(applyButton);
    await waitFor(() => {
      expect(mockSetMatchedDataSet).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ userImpressionsCount: 3 }),
          expect.objectContaining({ userImpressionsCount: 5 }),
        ])
      );
    });
  });
});
