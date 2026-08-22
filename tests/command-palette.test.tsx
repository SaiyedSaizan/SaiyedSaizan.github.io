import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CommandPalette } from "@/components/command-palette";

describe("CommandPalette", () => {
  it("filters commands and closes with Escape", () => {
    const close = vi.fn();
    render(<CommandPalette open onClose={close} />);

    const input = screen.getByRole("textbox", { name: /search commands/i });
    fireEvent.change(input, { target: { value: "flow" } });

    expect(screen.getByRole("option", { name: /Inspect Flow/i })).toBeInTheDocument();
    expect(screen.queryByRole("option", { name: /LinkedIn/i })).not.toBeInTheDocument();

    fireEvent.keyDown(input, { key: "Escape" });
    expect(close).toHaveBeenCalledOnce();
  });

  it("traps reverse tab navigation inside the dialog", () => {
    render(<CommandPalette open onClose={() => {}} />);
    const input = screen.getByRole("textbox", { name: /search commands/i });
    input.focus();
    fireEvent.keyDown(input, { key: "Tab", shiftKey: true });
    expect(document.activeElement).toBe(screen.getAllByRole("option").at(-1));
  });
});
