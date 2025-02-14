/**
 * 组合式函数
 * 使用 ResizeObserver 观察 DOM 元素尺寸变化
 *
 * 该函数提供了一种方便的方式来观察一个或多个元素的尺寸变化，并在变化时执行指定的回调函数。
 *
 * @param target 要观察的目标，可以是 Ref 对象、Ref 数组、HTMLElement 或 HTMLElement 数组
 * @param callback 当元素尺寸变化时调用的回调函数
 * @param options ResizeObserver 选项，用于定制观察行为
 * @returns 返回一个对象，包含停止和开始观察的方法，使用者可以调用 start 方法开始观察，调用 stop 方法停止观察
 */
import { ref, toValue, computed, watch, onBeforeUnmount } from 'vue'
import type { Ref } from 'vue'
export function useResizeObserver(target: Ref | Ref[] | HTMLElement | HTMLElement[], callback: ResizeObserverCallback, options = {} ) {
    let observer: ResizeObserver | undefined
    const stopObservation = ref(false)
    const targets = computed(() => {
        const targetsValue = toValue(target)
        if (targetsValue) {
            if (Array.isArray(targetsValue)) {
                return targetsValue.map((el: any) => toValue(el)).filter((el: any) => el)
            } else {
                return [targetsValue]
            }
        }
        return []
    })
    // 定义清理函数，用于断开 ResizeObserver 的连接
    const cleanup = () => {
        if (observer) {
            observer.disconnect()
            observer = undefined
        }
    }
    // 初始化 ResizeObserver，开始观察目标元素
    const observeElements = () => {
        if (targets.value.length && !stopObservation.value) {
            observer = new ResizeObserver(callback)
            targets.value.forEach((element: HTMLElement) => observer!.observe(element, options))
        }
    }
    // 监听 targets 的变化，当 targets 变化时，重新建立 ResizeObserver 观察
    watch(
        () => targets.value,
        () => {
            cleanup()
            observeElements()
        },
        {
            immediate: true, // 立即触发回调，以便初始状态也被观察
            flush: 'post'
        }
    )
    const stop = () => {
        stopObservation.value = true
        cleanup()
    }
    const start = () => {
        stopObservation.value = false
        observeElements()
    }
    // 在组件卸载前清理 ResizeObserver
    onBeforeUnmount(() => cleanup())
    return {
        stop,
        start
    }
}
