import { describe, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Card from "./index";

describe("Card", () => {
  const mockProps = {
    createdTime: "2022-07-25T01:33:41.000Z",
    fields: {
      Id: 75,
      Name: "Charlie S. Gerardi",
      avatar: "https://example.com/avatar.jpg",
      occupation: "Residential electrician",
    },
    id: "recgdYSQnBR5gNzUX",
    totalRevenue: 100.0,
    userConversionsCount: 5,
    userImpressionsCount: 10,
    sortedChartData: [
      { date: "2022-07-01", countNum: 1 },
      { date: "2022-07-02", countNum: 2 },
    ],
  };

  test("renders user details correctly", () => {
    render(<Card {...mockProps} />);
    expect(screen.getByText(mockProps.fields.Name)).toBeInTheDocument();
    expect(screen.getByText(mockProps.fields.occupation)).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: mockProps.fields.Name })
    ).toHaveAttribute("src", mockProps.fields.avatar);
  });

  test("renders line chart for conversion data", () => {
    render(<Card {...mockProps} />);
    expect(screen.getByText(`Conversions 07/01 - 07/02`)).toBeInTheDocument();
  });

  test("displays correct counts for impressions and conversions", () => {
    render(<Card {...mockProps} />);
    expect(
      screen.getByText(mockProps.userImpressionsCount.toString())
    ).toBeInTheDocument();
    expect(
      screen.getByText(mockProps.userConversionsCount.toString())
    ).toBeInTheDocument();
  });

  test("displays correct total revenue", () => {
    render(<Card {...mockProps} />);
    expect(
      screen.getByText(`$${mockProps.totalRevenue.toFixed(2)}`)
    ).toBeInTheDocument();
  });
});
