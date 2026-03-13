import { z } from "zod"

export const weightKgSchema = z
  .number({ message: "Enter a valid weight" })
  .positive("Weight must be greater than 0")
  .max(500, "Weight must be under 500 kg")

export const weightLbSchema = z
  .number({ message: "Enter a valid weight" })
  .positive("Weight must be greater than 0")
  .max(1100, "Weight must be under 1100 lb")

export const heightCmSchema = z
  .number({ message: "Enter a valid height" })
  .positive("Height must be greater than 0")
  .max(300, "Height must be under 300 cm")

export const heightFtSchema = z
  .number({ message: "Enter a valid height" })
  .int("Feet must be a whole number")
  .min(0, "Feet cannot be negative")
  .max(9, "Feet must be 9 or under")

export const heightInSchema = z
  .number({ message: "Enter a valid height" })
  .min(0, "Inches cannot be negative")
  .max(11.9, "Inches must be under 12")

export const ageSchema = z
  .number({ message: "Enter a valid age" })
  .int("Age must be a whole number")
  .min(1, "Age must be at least 1")
  .max(120, "Age must be under 120")
