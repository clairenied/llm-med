import { describe, expect, it } from "vitest";

import {
  analyzeDuplicateSuffix,
  MIN_REPEATED_LINE_LENGTH,
} from "../../dev-tools/cleanup-review-content-duplicates";

const longLine = (label: string, length = MIN_REPEATED_LINE_LENGTH) =>
  `${label} ${"x".repeat(length - label.length - 1)}`;

describe("analyzeDuplicateSuffix", () => {
  it("returns null when content is not duplicated", () => {
    expect(analyzeDuplicateSuffix(`Original review\n${longLine("one")}`)).toBeNull();
  });

  it("removes a suffix containing two distinct repeated long lines", () => {
    const first = longLine("first");
    const second = longLine("second");
    const original = `Original review content that is safely longer than fifty characters.\n${first}\n${second}`;
    const content = `${original}\n${first}\n${second}`;

    const result = analyzeDuplicateSuffix(content);

    expect(result?.cleaned).toBe(original);
    expect(result?.duplicatedLineCount).toBe(2);
  });

  it("does not count the same duplicated line twice", () => {
    const repeated = longLine("single");
    const content = `Original review content that is safely longer than fifty characters.\n${repeated}\n${repeated}`;

    expect(analyzeDuplicateSuffix(content)).toBeNull();
  });

  it("accepts one exceptionally long duplicated line", () => {
    const repeated = longLine("large", 501);
    const original = `Original review content that is safely longer than fifty characters.\n${repeated}`;

    expect(analyzeDuplicateSuffix(`${original}\n${repeated}`)?.cleaned).toBe(original);
  });

  it("ignores repeated lines below the conservative length threshold", () => {
    const first = "first short repeated line";
    const second = "second short repeated line";
    const content = `Original review content that is safely longer than fifty characters.\n${first}\n${second}\n${first}\n${second}`;

    expect(analyzeDuplicateSuffix(content)).toBeNull();
  });
});
