"use client"

import type React from "react"

import Image from "next/image"
import { Code, Cpu, Users, Layers, CheckCircle, AlertTriangle, X } from 'lucide-react'
import { useActionState, useEffect, useRef, useState } from "react"
import { subscribeEmail } from "./actions"
import { cn } from "@/lib/utils"
import { useMouseParticles } from "@/hooks/use-mouse-particles"

function ParticleCanvas({ color }: { color: string }) {
const canvasRef = useRef<HTMLCanvasElement>(null)
useMouseParticles(canvasRef, color)
return <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full z-0" />
}

export default function ComingSoonPageV5() {
const formRef = useRef<HTMLFormElement>(null)
const [state, formAction, isPending] = useActionState(subscribeEmail, {
  success: false,
  message: "",
})

// Modal state voor service enquiry
const [isModalOpen, setIsModalOpen] = useState(false)
const [selectedService, setSelectedService] = useState("")
const [modalForm, setModalForm] = useState({
  firstName: "",
  lastName: "",
  email: "",
  optIn: false
})

useEffect(() => {
  if (state.success) {
    formRef.current?.reset()
  }
}, [state.success])

const openServiceModal = (serviceName: string) => {
  setSelectedService(serviceName)
  setIsModalOpen(true)
}

const closeModal = () => {
  setIsModalOpen(false)
  setModalForm({ firstName: "", lastName: "", email: "", optIn: false })
}

const handleModalSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  
  if (!modalForm.optIn) {
    alert("Je moet akkoord gaan met de voorwaarden om door te gaan.")
    return
  }

  try {
    const params = new URLSearchParams({
      type: "service_inquiry",
      service: selectedService,
      firstName: modalForm.firstName,
      lastName: modalForm.lastName,
      email: modalForm.email,
      optIn: modalForm.optIn.toString(),
      timestamp: new Date().toISOString(),
      source: "service_modal"
    })

               const getUrl = `https://hugo0908.app.n8n.cloud/webhook-test/1cee2223-b8a0-4d08-bd48-9d9987ee2dee?${params.toString()}`
    console.log("Sending GET service inquiry to webhook:", getUrl)

    const response = await fetch(getUrl, {
      method: "GET",
    })

    console.log("Service webhook response status:", response.status)
    const responseText = await response.text()
    console.log("Service webhook response:", responseText)

    if (response.ok) {
      alert("Bedankt! We nemen binnenkort contact met je op.")
      closeModal()
    } else {
      console.error("Service webhook response not OK:", responseText)
      alert("Er is iets misgegaan. Probeer het opnieuw.")
    }
  } catch (error) {
    console.error("Service webhook error:", error)
    alert("Er is iets misgegaan. Probeer het opnieuw.")
  }
}

return (
  <div className="font-sans antialiased bg-juno-dark-blue">
    {/* Hero Section */}
    <div className="bg-white relative">
      <ParticleCanvas color="rgba(0, 9, 60, 0.1)" />
      <div className="relative z-10">
        <header className="container mx-auto px-6 pt-8">
          <Image src="/logo.png" alt="Juno1 Logo" width={180} height={48} priority />
        </header>
        <main className="container mx-auto px-6 py-16 md:py-20">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="text-center lg:text-left">
              <div className="mb-8 inline-block rounded-full border-2 border-juno-red bg-red-50 px-6 py-3 text-lg font-bold text-juno-red tracking-wide">
                NEW WEBSITE COMING SOON
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-juno-dark-blue sm:text-5xl lg:text-6xl font-akkurat">
                Crafting Visions,
                <br />
                <span className="text-juno-red">You know we can</span>
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600 max-w-lg mx-auto lg:mx-0">
                Heeft u vragen of wensen mbt software of ai toepassingen? Neem dan vast contact op
              </p>

              <form ref={formRef} action={formAction} className="mt-10 mx-auto max-w-md space-y-4 lg:mx-0">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      name="firstName"
                      required
                      className="block w-full rounded-md border-0 bg-white/5 px-4 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-juno-cyan sm:text-sm sm:leading-6 transition-all duration-300"
                      placeholder="Voornaam"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      name="lastName"
                      required
                      className="block w-full rounded-md border-0 bg-white/5 px-4 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-juno-cyan sm:text-sm sm:leading-6 transition-all duration-300"
                      placeholder="Achternaam"
                    />
                  </div>
                </div>
                <div>
                  <input
                    type="email"
                    name="email"
                    required
                    className="block w-full rounded-md border-0 bg-white/5 px-4 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-juno-cyan sm:text-sm sm:leading-6 transition-all duration-300"
                    placeholder="Jouw e-mailadres"
                  />
                </div>
                
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    name="optIn"
                    id="heroOptIn"
                    required
                    className="mt-1 h-4 w-4 text-juno-cyan border-gray-300 rounded focus:ring-juno-cyan"
                  />
                  <label htmlFor="heroOptIn" className="text-sm text-gray-600">
                    Ik ga akkoord met het ontvangen van informatie over de diensten van Juno1. *
                  </label>
                </div>
                
                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full flex justify-center rounded-md bg-juno-dark-blue px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-juno-dark-blue/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-juno-dark-blue disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300"
                >
                  {isPending ? "Versturen..." : "Neem alvast contact op"}
                </button>
                {state.message && (
                  <div
                    className={cn(
                      "flex items-center justify-center lg:justify-start gap-2 pt-2 text-sm",
                      state.success ? "text-green-600" : "text-red-600",
                    )}
                  >
                    {state.success ? <CheckCircle className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
                    {state.message}
                  </div>
                )}
              </form>
            </div>
            <div className="relative h-80 w-full lg:h-full">
              <div className="aspect-w-16 aspect-h-9 h-full w-full overflow-hidden rounded-3xl shadow-2xl">
                <video autoPlay loop muted playsInline className="h-full w-full object-cover" key="hero-video">
                  <source src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/65df1a7cbc555c74edb21e63_60955339c3c85378c69ee4d5_Header%20DIQQ%202021-transcode-49GlBAXiZgcXfOwYWaptF9n4GjLX58.webm" type="video/webm" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>

    {/* Services Section - Direct na hero */}
    <section 
      className="relative bg-juno-dark-blue text-white" 
      style={{ 
        zIndex: 2,
        paddingTop: '80px'
      }}
    >
      {/* White curved top */}
      <div 
        className="absolute top-0 left-0 w-full bg-white"
        style={{
          height: '100px',
          borderRadius: '0 0 50% 50%',
          transform: 'translateY(-50px)'
        }}
      />
      <ParticleCanvas color="rgba(86, 227, 207, 0.3)" />
        <div className="relative z-10 container mx-auto px-6 py-20 sm:py-24">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl font-akkurat">
              Wat we voor je kunnen betekenen
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              Van offshore development teams tot geavanceerde AI-oplossingen, wij leveren de expertise die jouw bedrijf
              naar een hoger niveau tilt.
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 text-center sm:grid-cols-2 lg:max-w-none lg:grid-cols-4">
            <ServiceCard
              icon={<Cpu className="h-8 w-8" />}
              title="AI Innovatie"
              description="AI-specialisten en ontwikkeling van maatwerk AI-software."
              onClick={() => openServiceModal('AI Innovatie')}
            />
            <ServiceCard
              icon={<Code className="h-8 w-8" />}
              title="Software Development"
              description="Ontwikkeling van robuuste en schaalbare softwareoplossingen."
              onClick={() => openServiceModal('Software Development')}
            />
            <ServiceCard
              icon={<Layers className="h-8 w-8" />}
              title="BIM"
              description="Gespecialiseerde offshore BIM modelleurs voor uw projecten."
              onClick={() => openServiceModal('BIM')}
            />
            <ServiceCard
              icon={<Users className="h-8 w-8" />}
              title="Offshore Teams"
              description="Toegewijde offshore teams om uw capaciteit te vergroten."
              onClick={() => openServiceModal('Offshore Teams')}
            />
          </div>
        </div>
      </section>

    <footer className="bg-juno-dark-blue text-center py-8">
      <p className="text-gray-500">&copy; {new Date().getFullYear()} Juno1. Alle rechten voorbehouden.</p>
    </footer>

    {/* Service Enquiry Modal */}
    {isModalOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 relative">
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
          
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-juno-dark-blue mb-2">
              Interesse in {selectedService}?
            </h3>
            <p className="text-gray-600">
              Laat je gegevens achter en we nemen snel contact met je op.
            </p>
          </div>

          <form onSubmit={handleModalSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                  Voornaam *
                </label>
                <input
                  type="text"
                  id="firstName"
                  required
                  value={modalForm.firstName}
                  onChange={(e) => setModalForm(prev => ({ ...prev, firstName: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-juno-cyan focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                  Achternaam *
                </label>
                <input
                  type="text"
                  id="lastName"
                  required
                  value={modalForm.lastName}
                  onChange={(e) => setModalForm(prev => ({ ...prev, lastName: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-juno-cyan focus:border-transparent"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="modalEmail" className="block text-sm font-medium text-gray-700 mb-1">
                E-mailadres *
              </label>
              <input
                type="email"
                id="modalEmail"
                required
                value={modalForm.email}
                onChange={(e) => setModalForm(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-juno-cyan focus:border-transparent"
              />
            </div>

            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="optIn"
                checked={modalForm.optIn}
                onChange={(e) => setModalForm(prev => ({ ...prev, optIn: e.target.checked }))}
                className="mt-1 h-4 w-4 text-juno-cyan border-gray-300 rounded focus:ring-juno-cyan"
              />
              <label htmlFor="optIn" className="text-sm text-gray-700">
                Ik ga akkoord met het ontvangen van informatie over {selectedService} en andere diensten van Juno1. *
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-juno-dark-blue text-white py-3 px-4 rounded-md hover:bg-juno-dark-blue/90 transition-colors font-semibold"
            >
              Verstuur aanvraag
            </button>
          </form>
        </div>
      </div>
    )}
  </div>
)
}

function ServiceCard({ 
  icon, 
  title, 
  description, 
  onClick 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
  onClick?: () => void;
}) {
return (
  <div 
    onClick={onClick}
    className="flex flex-col items-center p-8 rounded-xl bg-white/5 transition-all duration-300 hover:bg-white/10 cursor-pointer hover:scale-105 active:scale-95"
  >
    <div className="text-juno-cyan mb-6">{icon}</div>
    <h3 className="text-xl font-semibold leading-7 text-white font-akkurat">{title}</h3>
    <p className="mt-2 text-base leading-7 text-gray-300">{description}</p>
    <div className="mt-4 text-juno-cyan text-sm font-medium">
      Klik voor meer informatie →
    </div>
  </div>
)
}
