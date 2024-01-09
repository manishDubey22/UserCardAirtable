import { render, cleanup, waitFor, screen } from "@testing-library/react";
import { describe, expect, vi } from "vitest";
import "@testing-library/jest-dom";
import App from "./App";

const mockUserData = {
  records: [
    {
      id: "recgdYSQnBR5gNzUX",
      createdTime: "2022-07-25T01:33:41.000Z",
      fields: {
        Id: 75,
        Name: "Charlie S. Gerardi",
        avatar:
          "https://s3.amazonaws.com/uifaces/faces/twitter/brad_frost/128.jpg",
        occupation: "Residential electrician",
      },
    },
    {
      id: "recgkrD34eAuAtmH6",
      createdTime: "2022-07-25T01:33:41.000Z",
      fields: {
        Id: 23,
        Name: "Riley D. Norris",
        occupation: "Transmission engineer",
      },
    },
    {
      id: "recH7Dd7VQgXkJhfl",
      createdTime: "2022-07-25T01:33:41.000Z",
      fields: {
        Id: 45,
        Name: "Aaron E. Poynton",
        avatar:
          "https://s3.amazonaws.com/uifaces/faces/twitter/c_southam/128.jpg",
        occupation: "Public address system announcer",
      },
    },
  ],
};

const mockLogData = [
  { time: "2013-04-17 18:52:33", type: "impression", user_id: 75, revenue: 0 },
  { time: "2013-05-07 12:31:00", type: "conversion", user_id: 75, revenue: 0 },
  {
    time: "2013-04-09 14:35:43",
    type: "conversion",
    user_id: 23,
    revenue: 44.61,
  },
  {
    time: "2013-04-14 07:39:05",
    type: "conversion",
    user_id: 23,
    revenue: 57.88,
  },
  { time: "2013-04-15 16:05:47", type: "conversion", user_id: 45, revenue: 0 },
  { time: "2013-05-06 14:03:49", type: "impression", user_id: 45, revenue: 0 },
  { time: "2013-05-02 09:20:54", type: "conversion", user_id: 75, revenue: 0 },
  {
    time: "2013-04-26 00:41:38",
    type: "conversion",
    user_id: 23,
    revenue: 82.19,
  },
];

describe("App", () => {
  afterEach(cleanup);
  test("should render without an error", () => {
    expect(() => {
      render(<App />);
    }).not.toThrow();
  });

  test("should displays NoDataFound when there is no data", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      json: () => Promise.resolve({ records: [] }),
    } as Response);

    render(<App />);
    await waitFor(() => {
      expect(screen.getByText(/no data found/i)).toBeInTheDocument();
    });

    vi.restoreAllMocks();
  });

  test.skip("should display Card with data", async () => {
    vi.spyOn(globalThis, "fetch")
      .mockResolvedValueOnce({
        json: () => Promise.resolve(mockUserData),
      } as Response)
      .mockResolvedValueOnce({
        json: () => Promise.resolve(mockLogData),
      } as Response);

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("Aaron E. Poynton")).toBeInTheDocument();
    });

    const cardComponents = screen.getAllByTestId("card-component");
    expect(cardComponents.length).toBe(mockUserData.records.length);

    vi.restoreAllMocks();
  });
});
