import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FlowLab } from "@/components/flow-lab";
import { scenarios } from "@/data/scenarios";

describe("FlowLab", () => {
  it("steps through a trace and reveals the grounded response", () => {
    render(<FlowLab />);

    const step = screen.getByRole("button", { name: /^step/i });
    fireEvent.click(step);
    expect(screen.getByText("Request split")).toBeInTheDocument();

    for (let index = 1; index < scenarios[0].events.length; index += 1) fireEvent.click(step);

    expect(screen.getByText(/stops short of clearing you for the course/)).toBeInTheDocument();
    expect(step).toBeDisabled();
  });

  it("switches scenarios and resets the trace", () => {
    render(<FlowLab />);
    fireEvent.click(screen.getByRole("button", { name: /^step/i }));
    expect(screen.getByText("Request split")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("tab", { name: /Check what is open/i }));

    expect(screen.queryByText("Request split")).not.toBeInTheDocument();
    expect(screen.getByText(/how busy is College Library right now/)).toBeInTheDocument();
    expect(screen.getByText(/Trace ready/)).toBeInTheDocument();
  });

  it("implements arrow-key navigation across the scenario tabs", () => {
    render(<FlowLab />);
    const first = screen.getByRole("tab", { name: /Plan a course/i });
    fireEvent.keyDown(first, { key: "ArrowRight" });
    expect(screen.getByRole("tab", { name: /Check what is open/i })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });
});
