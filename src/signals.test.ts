import assert from "assert";
import { suite, test } from "node:test";
import { Signal } from "./signals";

void suite("Testing for Signals", () => {
  void test("It should create a signal with initial value", () => {
    const signal = new Signal(1);

    assert.strictEqual(
      signal.value,
      1,
      "The initial value of signal is not set correctly."
    );
  });

  void test("It should update when signal changed", () => {
    const signal = new Signal(1);

    assert.strictEqual(
      signal.value,
      1,
      "The initial value of signal is not set correctly."
    );

    signal.value = 2;

    assert.strictEqual(
      signal.value,
      2,
      "The value of signal is not updated correctly."
    );
  });

  void test("It should not update when signal changed to the same value", () => {
    const signal = new Signal(1);

    assert.strictEqual(
      signal.value,
      1,
      "The initial value of signal is not set correctly."
    );

    signal.value = 1;

    assert.strictEqual(
      signal.value,
      1,
      "The value of signal is not updated correctly."
    );
  });

  void test("It should create a computed signal with initial value", () => {
    const computed = Signal.computed(() => 1);

    assert.strictEqual(
      computed.value,
      1,
      "The initial computed value is not set correctly."
    );
  });

  void test("It should create a computed signal with initial value from base signal", () => {
    const signalA = new Signal(1);
    const computed = Signal.computed(() => signalA.value);

    assert.strictEqual(
      computed.value,
      1,
      "The initial computed value is not set correctly."
    );
  });

  void test("It should update when base signal changed", () => {
    const signalA = new Signal(1);
    const computed = Signal.computed(() => signalA.value + 1);

    signalA.value = 2;

    assert.strictEqual(
      computed.value,
      3,
      "The computed value is not updated correctly."
    );
  });

  void test("It should update when some base signal changed", () => {
    const signalA = new Signal(1);
    const signalB = new Signal(2);
    const computed = Signal.computed(() => signalA.value + signalB.value);

    signalA.value = 2;

    assert.strictEqual(
      computed.value,
      4,
      "The computed value is not updated correctly when Signal A changed."
    );

    signalB.value = 3;

    assert.strictEqual(
      computed.value,
      5,
      "The computed value is not updated correctly when Signal B changed."
    );

    signalA.value = 3;
    signalB.value = 4;

    assert.strictEqual(
      computed.value,
      7,
      "The computed value is not updated correctly when both Signal A and B changed."
    );
  });

  void test("It should not update when parent signal is not changed", () => {
    const signalA = new Signal(1);
    const signalB = new Signal(1);
    const signalC = new Signal(1);
    const computedA = Signal.computed(() => signalA.value + 1);
    const computedB = Signal.computed(() => signalA.value + signalB.value);
    const computedC = Signal.computed(() => signalC.value * 2);

    signalA.value = 2;

    assert.strictEqual(
      computedA.value,
      3,
      "The Computed A value is not updated correctly when Signal A changed."
    );
    assert.strictEqual(
      computedB.value,
      3,
      "The Computed B value is not updated correctly when Signal A changed."
    );
    assert.strictEqual(
      computedC.value,
      2,
      "The Computed C value updated when Signal A changed."
    );

    signalB.value = 2;

    assert.strictEqual(
      computedA.value,
      3,
      "The Computed signal A value updated when Signal B changed."
    );
    assert.strictEqual(
      computedB.value,
      4,
      "The Computed signal B value is not updated correctly when Signal B changed."
    );
    assert.strictEqual(
      computedC.value,
      2,
      "The Computed signal C value updated when Signal B changed."
    );

    signalC.value = 2;

    assert.strictEqual(
      computedA.value,
      3,
      "The Computed signal A value updated when Signal C changed."
    );
    assert.strictEqual(
      computedB.value,
      4,
      "The Computed signal B value updated when Signal C changed."
    );
    assert.strictEqual(
      computedC.value,
      4,
      "The Computed signal C value is not updated correctly when Signal C changed."
    );
  });

  void test("It should update when using computed signals in other computed signals", () => {
    const signalA = new Signal(1);
    const signalB = new Signal(2);
    const computedA = Signal.computed(() => signalA.value + 1);
    const computedB = Signal.computed(() => signalB.value + 1);
    const computedC = Signal.computed(() => computedA.value + computedB.value);

    signalA.value = 2;

    assert.strictEqual(
      computedC.value,
      6,
      "The Computed signal C value is not updated correctly when Signal A changed."
    );

    signalB.value = 3;

    assert.strictEqual(
      computedC.value,
      7,
      "The Computed signal C value is not updated correctly when Signal B changed."
    );
  });
});
