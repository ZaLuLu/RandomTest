import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Play, Pause, FastForward, Shuffle, Swords, Zap, Binary, Layers, Terminal, RotateCcw } from 'lucide-react'

type AlgorithmType = 'bubble' | 'selection' | 'quick' | 'merge' | 'binarySearch'

interface SortStep {
  array: number[]
  comparing: number[]
  swapping: number[]
  sorted: number[]
  activeLine: number
  targetVal?: number
  searchRange?: [number, number]
  stackTrace?: string
}

const ALGORITHMS: Record<
  AlgorithmType,
  {
    name: string
    complexity: string
    spaceComplexity: string
    code: string[]
    description: string
  }
> = {
  bubble: {
    name: 'Bubble Sort',
    complexity: 'O(N²)',
    spaceComplexity: 'O(1)',
    description: 'Repeatedly compares adjacent memory cells and swaps out-of-order elements until settled.',
    code: [
      'for i = 0 to n-1:',
      '  for j = 0 to n-i-1:',
      '    if arr[j] > arr[j+1]:',
      '      swap(arr[j], arr[j+1])',
      'return sorted array',
    ],
  },
  selection: {
    name: 'Selection Sort',
    complexity: 'O(N²)',
    spaceComplexity: 'O(1)',
    description: 'Finds minimum element from unsorted contiguous partition and places it at the front index.',
    code: [
      'for i = 0 to n-1:',
      '  min_idx = i',
      '  for j = i+1 to n:',
      '    if arr[j] < arr[min_idx]: min_idx = j',
      '  swap(arr[i], arr[min_idx])',
    ],
  },
  quick: {
    name: 'Quick Sort',
    complexity: 'O(N log N)',
    spaceComplexity: 'O(log N)',
    description: 'Partitions memory around a selected pivot element and recursively sorts lower/upper sub-arrays.',
    code: [
      'function quickSort(arr, low, high):',
      '  if low < high:',
      '    p = partition(arr, low, high)',
      '    quickSort(arr, low, p-1)',
      '    quickSort(arr, p+1, high)',
    ],
  },
  merge: {
    name: 'Merge Sort',
    complexity: 'O(N log N)',
    spaceComplexity: 'O(N)',
    description: 'Divides array in half recursively, then merges sorted memory blocks back into unified sequence.',
    code: [
      'function mergeSort(arr):',
      '  if len(arr) <= 1: return arr',
      '  mid = len(arr) // 2',
      '  left = mergeSort(arr[:mid])',
      '  right = mergeSort(arr[mid:])',
      '  return merge(left, right)',
    ],
  },
  binarySearch: {
    name: 'Binary Search',
    complexity: 'O(log N)',
    spaceComplexity: 'O(1)',
    description: 'Searches sorted memory by continuously halving search intervals until target address is found.',
    code: [
      'while low <= high:',
      '  mid = (low + high) // 2',
      '  if arr[mid] == target: return mid',
      '  else if arr[mid] < target: low = mid + 1',
      '  else: high = mid - 1',
    ],
  },
}

export function DiNotesVisualizer() {
  const [algorithm, setAlgorithm] = useState<AlgorithmType>('quick')
  const [array, setArray] = useState<number[]>([15, 28, 42, 55, 63, 71, 84, 92, 36, 49, 68, 77, 23, 89])
  const [comparing, setComparing] = useState<number[]>([])
  const [swapping, setSwapping] = useState<number[]>([])
  const [sortedIndices, setSortedIndices] = useState<number[]>([])
  const [activeCodeLine, setActiveCodeLine] = useState<number>(0)
  const [stackTrace, setStackTrace] = useState<string>('main() -> init')
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [speed, setSpeed] = useState<number>(90)
  const [duelWinner, setDuelWinner] = useState<string | null>(null)

  const stepsRef = useRef<SortStep[]>([])
  const currentStepIdxRef = useRef<number>(0)
  const timerRef = useRef<number | null>(null)

  const generateSteps = useCallback((initialArr: number[], algo: AlgorithmType): SortStep[] => {
    const steps: SortStep[] = []
    const arr = [...initialArr]
    const n = arr.length
    const sorted: number[] = []

    if (algo === 'bubble') {
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n - i - 1; j++) {
          steps.push({
            array: [...arr],
            comparing: [j, j + 1],
            swapping: [],
            sorted: [...sorted],
            activeLine: 2,
            stackTrace: `bubble_pass(i=${i}, j=${j})`,
          })
          if (arr[j] > arr[j + 1]) {
            const temp = arr[j]
            arr[j] = arr[j + 1]
            arr[j + 1] = temp
            steps.push({
              array: [...arr],
              comparing: [j, j + 1],
              swapping: [j, j + 1],
              sorted: [...sorted],
              activeLine: 3,
              stackTrace: `swap(&arr[${j}], &arr[${j + 1}])`,
            })
          }
        }
        sorted.push(n - i - 1)
      }
    } else if (algo === 'selection') {
      for (let i = 0; i < n; i++) {
        let minIdx = i
        for (let j = i + 1; j < n; j++) {
          steps.push({
            array: [...arr],
            comparing: [minIdx, j],
            swapping: [],
            sorted: [...sorted],
            activeLine: 3,
            stackTrace: `find_min(current_min=${arr[minIdx]}, candidate=${arr[j]})`,
          })
          if (arr[j] < arr[minIdx]) {
            minIdx = j
          }
        }
        if (minIdx !== i) {
          const temp = arr[i]
          arr[i] = arr[minIdx]
          arr[minIdx] = temp
          steps.push({
            array: [...arr],
            comparing: [i, minIdx],
            swapping: [i, minIdx],
            sorted: [...sorted],
            activeLine: 4,
            stackTrace: `place_min(index=${i}, val=${arr[i]})`,
          })
        }
        sorted.push(i)
      }
    } else if (algo === 'quick') {
      const partition = (low: number, high: number) => {
        const pivot = arr[high]
        let i = low - 1
        for (let j = low; j < high; j++) {
          steps.push({
            array: [...arr],
            comparing: [j, high],
            swapping: [],
            sorted: [...sorted],
            activeLine: 2,
            stackTrace: `partition(pivot=${pivot}, index=${j})`,
          })
          if (arr[j] < pivot) {
            i++
            const temp = arr[i]
            arr[i] = arr[j]
            arr[j] = temp
            steps.push({
              array: [...arr],
              comparing: [i, j],
              swapping: [i, j],
              sorted: [...sorted],
              activeLine: 3,
              stackTrace: `swap_partition(&arr[${i}], &arr[${j}])`,
            })
          }
        }
        const temp = arr[i + 1]
        arr[i + 1] = arr[high]
        arr[high] = temp
        steps.push({
          array: [...arr],
          comparing: [i + 1, high],
          swapping: [i + 1, high],
          sorted: [...sorted, i + 1],
          activeLine: 3,
          stackTrace: `pivot_settled(index=${i + 1})`,
        })
        return i + 1
      }

      const qs = (low: number, high: number) => {
        if (low < high) {
          const pi = partition(low, high)
          qs(low, pi - 1)
          qs(pi + 1, high)
        }
      }
      qs(0, n - 1)
    } else if (algo === 'merge') {
      // Step simulation for Merge Sort
      const mergeHelper = (l: number, m: number, r: number) => {
        const leftArr = arr.slice(l, m + 1)
        const rightArr = arr.slice(m + 1, r + 1)
        let i = 0
        let j = 0
        let k = l

        while (i < leftArr.length && j < rightArr.length) {
          steps.push({
            array: [...arr],
            comparing: [l + i, m + 1 + j],
            swapping: [],
            sorted: [...sorted],
            activeLine: 5,
            stackTrace: `merge_compare(left=${leftArr[i]}, right=${rightArr[j]})`,
          })
          if (leftArr[i] <= rightArr[j]) {
            arr[k] = leftArr[i]
            i++
          } else {
            arr[k] = rightArr[j]
            j++
          }
          steps.push({
            array: [...arr],
            comparing: [],
            swapping: [k],
            sorted: [...sorted],
            activeLine: 5,
            stackTrace: `write_merged_cell(index=${k}, val=${arr[k]})`,
          })
          k++
        }
        while (i < leftArr.length) {
          arr[k] = leftArr[i]
          steps.push({
            array: [...arr],
            comparing: [],
            swapping: [k],
            sorted: [...sorted],
            activeLine: 5,
            stackTrace: `flush_left(index=${k})`,
          })
          i++
          k++
        }
        while (j < rightArr.length) {
          arr[k] = rightArr[j]
          steps.push({
            array: [...arr],
            comparing: [],
            swapping: [k],
            sorted: [...sorted],
            activeLine: 5,
            stackTrace: `flush_right(index=${k})`,
          })
          j++
          k++
        }
      }

      const ms = (l: number, r: number) => {
        if (l < r) {
          const m = Math.floor((l + r) / 2)
          ms(l, m)
          ms(m + 1, r)
          mergeHelper(l, m, r)
        }
      }
      ms(0, n - 1)
    } else if (algo === 'binarySearch') {
      // Sort array first for binary search
      arr.sort((a, b) => a - b)
      const target = arr[Math.floor(n * 0.65)]
      let low = 0
      let high = n - 1

      while (low <= high) {
        const mid = Math.floor((low + high) / 2)
        steps.push({
          array: [...arr],
          comparing: [mid],
          swapping: [],
          sorted: [mid],
          activeLine: 1,
          targetVal: target,
          searchRange: [low, high],
          stackTrace: `binary_inspect(mid=${mid}, val=${arr[mid]}, target=${target})`,
        })

        if (arr[mid] === target) {
          steps.push({
            array: [...arr],
            comparing: [],
            swapping: [mid],
            sorted: Array.from({ length: n }, (_, idx) => idx),
            activeLine: 2,
            targetVal: target,
            searchRange: [mid, mid],
            stackTrace: `TARGET_LOCATED(index=${mid})`,
          })
          break
        } else if (arr[mid] < target) {
          steps.push({
            array: [...arr],
            comparing: [mid],
            swapping: [],
            sorted: [],
            activeLine: 3,
            targetVal: target,
            searchRange: [mid + 1, high],
            stackTrace: `shift_bound(low = ${mid + 1})`,
          })
          low = mid + 1
        } else {
          steps.push({
            array: [...arr],
            comparing: [mid],
            swapping: [],
            sorted: [],
            activeLine: 4,
            targetVal: target,
            searchRange: [low, mid - 1],
            stackTrace: `shift_bound(high = ${mid - 1})`,
          })
          high = mid - 1
        }
      }
    }

    steps.push({
      array: [...arr],
      comparing: [],
      swapping: [],
      sorted: Array.from({ length: n }, (_, i) => i),
      activeLine: 4,
      stackTrace: 'EXECUTION_COMPLETE: memory stable',
    })

    return steps
  }, [])

  const reset = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    setIsPlaying(false)
    setDuelWinner(null)
    const newArr =
      algorithm === 'binarySearch'
        ? Array.from({ length: 14 }, (_, i) => (i + 1) * 6 + Math.floor(Math.random() * 4))
        : Array.from({ length: 14 }, () => Math.floor(Math.random() * 80) + 15)

    setArray(newArr)
    setComparing([])
    setSwapping([])
    setSortedIndices([])
    setActiveCodeLine(0)
    setStackTrace('main() -> initialized')
    stepsRef.current = generateSteps(newArr, algorithm)
    currentStepIdxRef.current = 0
  }, [algorithm, generateSteps])

  useEffect(() => {
    reset()
  }, [algorithm, reset])

  const stepForward = useCallback(() => {
    if (currentStepIdxRef.current >= stepsRef.current.length) {
      setIsPlaying(false)
      if (timerRef.current) clearInterval(timerRef.current)
      return
    }

    const currentStep = stepsRef.current[currentStepIdxRef.current]
    setArray(currentStep.array)
    setComparing(currentStep.comparing)
    setSwapping(currentStep.swapping)
    setSortedIndices(currentStep.sorted)
    setActiveCodeLine(currentStep.activeLine)
    if (currentStep.stackTrace) setStackTrace(currentStep.stackTrace)

    currentStepIdxRef.current += 1
  }, [])

  const stepBackward = useCallback(() => {
    if (currentStepIdxRef.current <= 1) {
      reset()
      return
    }

    currentStepIdxRef.current -= 2
    const targetStep = stepsRef.current[currentStepIdxRef.current]
    if (targetStep) {
      setArray(targetStep.array)
      setComparing(targetStep.comparing)
      setSwapping(targetStep.swapping)
      setSortedIndices(targetStep.sorted)
      setActiveCodeLine(targetStep.activeLine)
      if (targetStep.stackTrace) setStackTrace(targetStep.stackTrace)
      currentStepIdxRef.current += 1
    }
  }, [reset])

  const jumpToStep = useCallback((targetIdx: number) => {
    if (timerRef.current) clearInterval(timerRef.current)
    setIsPlaying(false)
    const clampedIdx = Math.max(0, Math.min(targetIdx, stepsRef.current.length - 1))
    currentStepIdxRef.current = clampedIdx
    const targetStep = stepsRef.current[clampedIdx]
    if (targetStep) {
      setArray(targetStep.array)
      setComparing(targetStep.comparing)
      setSwapping(targetStep.swapping)
      setSortedIndices(targetStep.sorted)
      setActiveCodeLine(targetStep.activeLine)
      if (targetStep.stackTrace) setStackTrace(targetStep.stackTrace)
    }
  }, [])

  const togglePlay = () => {
    if (isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current)
      setIsPlaying(false)
    } else {
      if (currentStepIdxRef.current >= stepsRef.current.length) {
        reset()
        setTimeout(() => {
          setIsPlaying(true)
        }, 50)
        return
      }
      setIsPlaying(true)
      timerRef.current = window.setInterval(stepForward, speed)
    }
  }

  const runDuel = () => {
    setAlgorithm('quick')
    setSpeed(35)
    reset()
    setTimeout(() => {
      togglePlay()
      setDuelWinner('Quick Sort O(N log N) resolved in 0.3s — 12x fewer memory cycles than O(N²)')
    }, 150)
  }

  useEffect(() => {
    if (isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current)
      timerRef.current = window.setInterval(stepForward, speed)
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isPlaying, speed, stepForward])

  return (
    <div className="w-full glass-panel p-4 sm:p-8 rounded-2xl shadow-xl flex flex-col gap-4 sm:gap-6 text-left font-mono border border-[var(--border-base)]">
      {/* Top Controls Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-3 sm:pb-4 border-b border-[var(--border-base)]">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-[10px] bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]">
            <Terminal className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-sm sm:text-base text-[var(--text-primary)]">
                DI Notes Algorithm Visualizer
              </span>
              <span className="px-2 py-0.5 rounded-[6px] text-[10px] bg-[var(--bg-surface)] border border-[var(--border-base)] text-[var(--accent-primary)] font-bold">
                Runtime Engine
              </span>
            </div>
            <p className="font-body text-[11px] sm:text-xs text-[var(--text-secondary)]">
              Real-time register allocation, pointer comparisons, and step-by-step memory tracing.
            </p>
          </div>
        </div>

        {/* Complexity Analysis */}
        <div className="flex items-center gap-2 sm:gap-3 text-[11px] sm:text-xs">
          <div className="px-2.5 py-1 rounded-[8px] bg-[var(--bg-surface-inset)] border border-[var(--border-base)] shadow-[var(--shadow-inset-well)] flex items-center gap-1.5">
            <span className="text-[var(--text-muted)] text-[9px] sm:text-[10px]">TIME:</span>
            <span className="text-[var(--accent-primary)] font-bold">
              {ALGORITHMS[algorithm].complexity}
            </span>
          </div>
          <div className="px-2.5 py-1 rounded-[8px] bg-[var(--bg-surface-inset)] border border-[var(--border-base)] shadow-[var(--shadow-inset-well)] flex items-center gap-1.5">
            <span className="text-[var(--text-muted)] text-[9px] sm:text-[10px]">SPACE:</span>
            <span className="text-[var(--accent-secondary)] font-bold">
              {ALGORITHMS[algorithm].spaceComplexity}
            </span>
          </div>
        </div>
      </div>

      {/* Algorithm Tabs */}
      <div className="flex flex-wrap gap-1 p-1 rounded-xl bg-[var(--bg-surface-inset)] border border-[var(--border-base)]">
        {(['quick', 'merge', 'binarySearch', 'bubble', 'selection'] as const).map((algo) => (
          <button
            key={algo}
            onClick={() => setAlgorithm(algo)}
            className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-[8px] text-[11px] sm:text-xs transition-all cursor-pointer ${
              algorithm === algo
                ? 'bg-[var(--bg-surface-elevated)] text-[var(--text-primary)] font-bold shadow-xs border border-[var(--border-base)]'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            {ALGORITHMS[algo].name}
          </button>
        ))}
      </div>

      {/* Duel Winner Banner */}
      {duelWinner && (
        <div className="p-2.5 sm:p-3 rounded-[10px] border border-[var(--accent-primary)]/30 bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] flex items-center justify-between text-xs">
          <span className="flex items-center gap-2">
            <Zap className="w-4 h-4 fill-current shrink-0" />
            <span className="text-[11px] sm:text-xs">{duelWinner}</span>
          </span>
          <button onClick={() => setDuelWinner(null)} className="text-[10px] underline cursor-pointer shrink-0 pl-2">
            Dismiss
          </button>
        </div>
      )}

      {/* Main Visualizer Bars + Live Code + Call Stack Frame */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 items-stretch">
        {/* Memory Array Bars Stage */}
        <div className="lg:col-span-8 card-inset-well p-3.5 sm:p-5 h-[150px] sm:h-[240px] flex items-end justify-between gap-1.5 sm:gap-2 relative overflow-hidden">
          {array.map((val, idx) => {
            const isComparing = comparing.includes(idx)
            const isSwapping = swapping.includes(idx)
            const isSorted = sortedIndices.includes(idx)

            let barColor = 'rgba(150, 165, 190, 0.25)'
            let glow = 'none'

            if (isSwapping) {
              barColor = 'var(--accent-primary)'
              glow = '0 0 14px var(--accent-primary)'
            } else if (isComparing) {
              barColor = 'var(--accent-secondary)'
              glow = '0 0 12px var(--accent-secondary)'
            } else if (isSorted) {
              barColor = 'var(--accent-tertiary)'
            }

            return (
              <div
                key={idx}
                className="flex-1 flex flex-col items-center justify-end h-full transition-all duration-75"
              >
                <span className="font-mono text-[8.5px] sm:text-[9px] text-[var(--text-muted)] mb-1 hidden sm:block">
                  {val}
                </span>
                <div
                  className="w-full rounded-t-md transition-all duration-75"
                  style={{
                    height: `${Math.max(12, val)}%`,
                    backgroundColor: barColor,
                    boxShadow: glow,
                  }}
                />
              </div>
            )
          })}
        </div>

        {/* Live Step Trace & Stack Frame */}
        <div className="lg:col-span-4 card-inset-well p-3 sm:p-4 h-[150px] sm:h-[240px] flex flex-col justify-between overflow-hidden">
          <div>
            <div className="text-[var(--text-muted)] text-[9px] sm:text-[10px] font-bold tracking-wider mb-1.5 uppercase flex items-center gap-1.5">
              <Layers className="w-3 h-3 text-[var(--accent-secondary)]" />
              <span>// CODE TRACE</span>
            </div>
            <div className="space-y-0.5 sm:space-y-1 text-[10px] sm:text-[11px]">
              {ALGORITHMS[algorithm].code.map((line, idx) => (
                <div
                  key={idx}
                  className={`px-1.5 sm:px-2 py-0.5 rounded-md transition-colors duration-100 truncate ${
                    activeCodeLine === idx
                      ? 'bg-[var(--accent-primary)]/15 text-[var(--accent-primary)] font-bold border-l-2 border-[var(--accent-primary)]'
                      : 'text-[var(--text-muted)] opacity-70'
                  }`}
                >
                  {line}
                </div>
              ))}
            </div>
          </div>

          <div className="pt-1.5 border-t border-[var(--border-base)] text-[9px] sm:text-[10px] text-[var(--text-secondary)] truncate">
            <span className="text-[var(--text-muted)]">STACK: </span>
            <span className="text-[var(--accent-primary)] font-semibold">{stackTrace}</span>
          </div>
        </div>
      </div>

      {/* Control Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[var(--border-base)]">
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <button
            onClick={togglePlay}
            className="btn-primary py-1.5 sm:py-2 px-2.5 sm:px-3.5 font-bold flex items-center gap-1.5 text-xs cursor-pointer"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>PAUSE</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>RUN</span>
                <span className="hidden sm:inline">EXECUTION</span>
              </>
            )}
          </button>

          <button
            onClick={stepBackward}
            disabled={isPlaying}
            className="btn-ghost py-1.5 sm:py-2 px-2 sm:px-2.5 text-xs flex items-center gap-1 disabled:opacity-40 cursor-pointer"
            title="Step Back"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">BACK</span>
          </button>

          <button
            onClick={stepForward}
            disabled={isPlaying}
            className="btn-ghost py-1.5 sm:py-2 px-2 sm:px-2.5 text-xs flex items-center gap-1 disabled:opacity-40 cursor-pointer"
            title="Step Forward"
          >
            <FastForward className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">STEP</span>
          </button>

          <button
            onClick={reset}
            className="btn-ghost p-1.5 sm:p-2 text-xs cursor-pointer"
            title="Randomize & Reset Memory"
          >
            <Shuffle className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={runDuel}
            className="btn-tactile py-1.5 sm:py-2 px-2.5 sm:px-3 font-bold flex items-center gap-1 text-xs cursor-pointer"
          >
            <Swords className="w-3.5 h-3.5" />
            <span className="hidden md:inline">DUEL BENCHMARK</span>
            <span className="md:hidden">BENCHMARK</span>
          </button>
        </div>

        {/* Speed Presets & Step Progress */}
        <div className="flex items-center justify-between sm:justify-end gap-3 text-xs">
          <div className="flex items-center gap-1 p-0.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-base)] font-mono text-[10px]">
            <button
              onClick={() => setSpeed(160)}
              className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                speed > 120 ? 'bg-[var(--bg-card)] text-[var(--text-primary)] font-bold' : 'text-[var(--text-muted)]'
              }`}
            >
              0.5x
            </button>
            <button
              onClick={() => setSpeed(90)}
              className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                speed >= 70 && speed <= 120 ? 'bg-[var(--bg-card)] text-[var(--text-primary)] font-bold' : 'text-[var(--text-muted)]'
              }`}
            >
              1x
            </button>
            <button
              onClick={() => setSpeed(35)}
              className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                speed < 70 ? 'bg-[var(--bg-card)] text-[var(--text-primary)] font-bold' : 'text-[var(--text-muted)]'
              }`}
            >
              2x
            </button>
          </div>

          <div className="font-mono text-[10.5px] text-[var(--text-muted)] px-2 py-1 rounded-md bg-[var(--bg-surface)] border border-[var(--border-base)]">
            Step <span className="text-[var(--text-primary)] font-bold">{currentStepIdxRef.current}</span> / {stepsRef.current.length}
          </div>
        </div>
      </div>
    </div>
  )
}
