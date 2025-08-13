"use server"

import { z } from "zod"

export async function subscribeEmail(prevState: any, formData: FormData) {
  const schema = z.object({
    firstName: z.string().min(1, { message: "Voornaam is verplicht." }),
    lastName: z.string().min(1, { message: "Achternaam is verplicht." }),
    email: z.string().email({ message: "Voer een geldig e-mailadres in." }),
    optIn: z.literal("on", { message: "Je moet akkoord gaan met de voorwaarden." }),
  })

  const parsed = schema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    optIn: formData.get("optIn"),
  })

  if (!parsed.success) {
    return { success: false, message: parsed.error.errors[0].message }
  }

  const { firstName, lastName, email, optIn } = parsed.data
  const webhookUrl = "https://hugo0908.app.n8n.cloud/webhook-test/1cee2223-b8a0-4d08-bd48-9d9987ee2dee"

  try {
    const params = new URLSearchParams({
      type: "email_subscription",
      firstName: firstName,
      lastName: lastName,
      email: email,
      optIn: "true",
      timestamp: new Date().toISOString(),
      source: "hero_form"
    })

    const getUrl = `${webhookUrl}?${params.toString()}`
    console.log("Sending GET to webhook:", getUrl)

    const response = await fetch(getUrl, {
      method: "GET",
    })

    console.log("Webhook response status:", response.status)
    const responseText = await response.text()
    console.log("Webhook response:", responseText)

    if (!response.ok) {
      console.error("Webhook response not OK:", responseText)
      return { success: false, message: "Er is iets misgegaan. Probeer het later opnieuw." }
    }

    return { success: true, message: `Bedankt ${firstName}! We houden je op de hoogte via ${email}.` }
  } catch (error) {
    console.error("Error sending to webhook:", error)
    return { success: false, message: "Kon geen verbinding maken. Probeer het later opnieuw." }
  }
}
