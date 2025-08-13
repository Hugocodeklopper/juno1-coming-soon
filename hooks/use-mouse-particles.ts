"use client"

import type React from "react"

import { useEffect, useRef } from "react"

interface Particle {
  x: number
  y: number
  size: number
  baseX: number
  baseY: number
  density: number
  vx: number
  vy: number
}

export function useMouseParticles(canvasRef: React.RefObject<HTMLCanvasElement>, color: string) {
  const mouse = useRef({ x: -1000, y: -1000, radius: 80 })
  const animationFrameId = useRef<number>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let particles: Particle[] = []

    const setupCanvas = () => {
      const dpr = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      ctx.scale(dpr, dpr)
    }

    const createParticles = () => {
      particles = []
      const rect = canvas.getBoundingClientRect()
      const particleCount = 300
      for (let i = 0; i < particleCount; i++) {
        const x = Math.random() * rect.width
        const y = Math.random() * rect.height
        particles.push({
          x: x,
          y: y,
          size: Math.random() * 1.5 + 0.5,
          baseX: x,
          baseY: y,
          density: Math.random() * 30 + 1,
          vx: 0,
          vy: 0,
        })
      }
    }

    const animate = () => {
      const rect = canvas.getBoundingClientRect()
      ctx.clearRect(0, 0, rect.width, rect.height)
      ctx.fillStyle = color

      particles.forEach((particle) => {
        const dx = mouse.current.x - particle.x
        const dy = mouse.current.y - particle.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        const forceDirectionX = dx / distance
        const forceDirectionY = dy / distance
        const maxDistance = mouse.current.radius
        const force = (maxDistance - distance) / maxDistance

        if (distance < mouse.current.radius) {
          particle.vx -= forceDirectionX * force * 0.1
          particle.vy -= forceDirectionY * force * 0.1
        }

        // Return to base position
        particle.vx += (particle.baseX - particle.x) * 0.01
        particle.vy += (particle.baseY - particle.y) * 0.01

        // Friction
        particle.vx *= 0.95
        particle.vy *= 0.95

        particle.x += particle.vx
        particle.y += particle.vy

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fill()
      })

      animationFrameId.current = requestAnimationFrame(animate)
    }

    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouse.current.x = event.clientX - rect.left
      mouse.current.y = event.clientY - rect.top
    }

    const handleMouseLeave = () => {
      mouse.current.x = -1000
      mouse.current.y = -1000
    }

    const handleResize = () => {
      setupCanvas()
      createParticles()
    }

    setupCanvas()
    createParticles()
    animate()

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseleave", handleMouseLeave)
    window.addEventListener("resize", handleResize)

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current)
      }
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseleave", handleMouseLeave)
      window.removeEventListener("resize", handleResize)
    }
  }, [canvasRef, color])
}
