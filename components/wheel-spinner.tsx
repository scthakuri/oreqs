'use client'

import React, { useEffect, useState, useRef } from 'react'

export interface WheelSegment {
    name: string
    color: string
    probability: number
}

export interface WheelSpinnerProps {
    segments: WheelSegment[]
    onFinished: (segment: string) => void
    primaryColor?: string
    contrastColor?: string
    buttonText?: string
    size?: number
    upDuration?: number
    downDuration?: number
    fontFamily?: string
    fontSize?: string
    outlineWidth?: number
}

const WheelSpinner = ({
    segments,
    onFinished,
    primaryColor = '#1e293b',
    contrastColor = '#ffffff',
    buttonText = 'SPIN',
    size = 280,
    upDuration = 100,
    downDuration = 600,
    fontFamily = 'system-ui, -apple-system, sans-serif',
    fontSize = '14px',
    outlineWidth = 8
}: WheelSpinnerProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const wheelRef = useRef<HTMLDivElement>(null)
    const dimension = (size + 20) * 2

    let currentSegment = ''
    let isStarted = false
    const [isFinished, setFinished] = useState(false)
    let timerHandle = 0
    const timerDelay = segments.length
    let angleCurrent = 0
    let angleDelta = 0
    let canvasContext: CanvasRenderingContext2D | null = null
    let maxSpeed = Math.PI / segments.length
    const upTime = segments.length * upDuration
    const downTime = segments.length * downDuration
    let spinStart = 0
    let frames = 0
    const centerX = size + 20
    const centerY = size + 20

    // Select winning segment based on probability
    const selectWinningSegment = (): string => {
        const random = Math.random() * 100
        let cumulative = 0

        for (const segment of segments) {
            cumulative += segment.probability
            if (random <= cumulative) {
                return segment.name
            }
        }

        return segments[0]?.name || ''
    }

    const [winningSegment, setWinningSegment] = useState('')

    useEffect(() => {
        wheelInit()
    }, [segments])

    const wheelInit = () => {
        initCanvas()
        wheelDraw()
    }

    const initCanvas = () => {
        const canvas = canvasRef.current
        if (canvas) {
            canvasContext = canvas.getContext('2d')
        }
    }

    const spin = () => {
        if (isStarted) return

        isStarted = true
        setFinished(false)
        setWinningSegment(selectWinningSegment())

        if (timerHandle === 0) {
            spinStart = new Date().getTime()
            maxSpeed = Math.PI / segments.length
            frames = 0
            timerHandle = window.setInterval(onTimerTick, timerDelay)
        }
    }

    const onTimerTick = () => {
        frames++
        draw()
        const duration = new Date().getTime() - spinStart
        let progress = 0
        let finished = false

        if (duration < upTime) {
            progress = duration / upTime
            angleDelta = maxSpeed * Math.sin((progress * Math.PI) / 2)
        } else {
            if (winningSegment) {
                if (currentSegment === winningSegment && frames > segments.length) {
                    progress = duration / upTime
                    angleDelta = maxSpeed * Math.sin((progress * Math.PI) / 2 + Math.PI / 2)
                    progress = 1
                } else {
                    progress = duration / downTime
                    angleDelta = maxSpeed * Math.sin((progress * Math.PI) / 2 + Math.PI / 2)
                }
            } else {
                progress = duration / downTime
                angleDelta = maxSpeed * Math.sin((progress * Math.PI) / 2 + Math.PI / 2)
            }
            if (progress >= 1) finished = true
        }

        angleCurrent += angleDelta
        while (angleCurrent >= Math.PI * 2) angleCurrent -= Math.PI * 2

        if (finished) {
            setFinished(true)
            onFinished(currentSegment)
            clearInterval(timerHandle)
            timerHandle = 0
            angleDelta = 0
            isStarted = false
        }
    }

    const wheelDraw = () => {
        clear()
        drawWheel()
        drawNeedle()
    }

    const draw = () => {
        clear()
        drawWheel()
        drawNeedle()
    }

    const drawSegment = (key: number, lastAngle: number, angle: number) => {
        if (!canvasContext) return

        const ctx = canvasContext
        const segment = segments[key]

        ctx.save()
        ctx.beginPath()
        ctx.moveTo(centerX, centerY)
        ctx.arc(centerX, centerY, size, lastAngle, angle, false)
        ctx.lineTo(centerX, centerY)
        ctx.closePath()
        ctx.fillStyle = segment.color
        ctx.fill()
        ctx.strokeStyle = 'rgba(0,0,0,0.3)'
        ctx.lineWidth = 2
        ctx.stroke()

        // Draw text
        ctx.save()
        ctx.translate(centerX, centerY)
        ctx.rotate((lastAngle + angle) / 2)

        // Position text at 70% from center
        const textRadius = size * 0.7

        ctx.fillStyle = contrastColor
        ctx.font = `bold ${fontSize} ${fontFamily}`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'

        const text = segment.name.length > 12 ? segment.name.substring(0, 10) + '..' : segment.name

        // Draw text with shadow for better visibility
        ctx.shadowColor = 'rgba(0, 0, 0, 0.8)'
        ctx.shadowBlur = 4
        ctx.shadowOffsetX = 2
        ctx.shadowOffsetY = 2
        ctx.fillStyle = contrastColor
        ctx.fillText(text, textRadius, 0)

        // Reset shadow
        ctx.shadowColor = 'transparent'
        ctx.shadowBlur = 0
        ctx.shadowOffsetX = 0
        ctx.shadowOffsetY = 0

        ctx.restore()
    }

    const drawWheel = () => {
        if (!canvasContext) return

        const ctx = canvasContext
        let lastAngle = angleCurrent
        const len = segments.length
        const PI2 = Math.PI * 2

        ctx.textBaseline = 'middle'
        ctx.textAlign = 'center'

        for (let i = 1; i <= len; i++) {
            const angle = PI2 * (i / len) + angleCurrent
            drawSegment(i - 1, lastAngle, angle)
            lastAngle = angle
        }

        // Draw center circle
        ctx.beginPath()
        ctx.arc(centerX, centerY, 50, 0, PI2, false)
        ctx.closePath()
        ctx.fillStyle = primaryColor
        ctx.lineWidth = 4
        ctx.strokeStyle = contrastColor
        ctx.fill()
        ctx.font = `bold 14px ${fontFamily}`
        ctx.fillStyle = contrastColor
        ctx.textAlign = 'center'
        ctx.fillText(buttonText, centerX, centerY + 3)
        ctx.stroke()

        // Draw outer circle
        ctx.beginPath()
        ctx.arc(centerX, centerY, size, 0, PI2, false)
        ctx.closePath()
        ctx.lineWidth = outlineWidth
        ctx.strokeStyle = primaryColor
        ctx.stroke()
    }

    const drawNeedle = () => {
        if (!canvasContext) return

        const ctx = canvasContext
        ctx.lineWidth = 1
        ctx.strokeStyle = '#f59e0b'
        ctx.fillStyle = '#f59e0b'
        ctx.beginPath()
        ctx.moveTo(centerX + 15, centerY - 50)
        ctx.lineTo(centerX - 15, centerY - 50)
        ctx.lineTo(centerX, centerY - 70)
        ctx.closePath()
        ctx.fill()

        const change = angleCurrent + Math.PI / 2
        let i = segments.length - Math.floor((change / (Math.PI * 2)) * segments.length) - 1
        if (i < 0) i = i + segments.length

        currentSegment = segments[i]?.name || ''
    }

    const clear = () => {
        if (!canvasContext) return
        canvasContext.clearRect(0, 0, dimension, dimension)
    }

    return (
        <div ref={wheelRef} className='inline-block'>
            <canvas
                ref={canvasRef}
                width={dimension}
                height={dimension}
                onClick={spin}
                className='cursor-pointer'
                style={{
                    maxWidth: '100%',
                    height: 'auto'
                }}
            />
        </div>
    )
}

export default WheelSpinner
