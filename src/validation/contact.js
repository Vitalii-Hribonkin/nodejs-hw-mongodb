import Joi from "joi";
import { typeList } from "../constants/contacts.js";

const phoneRegex = /^(\+?\d{10,15})$/;

export const contactAddSchema = Joi.object({
    name: Joi.string()
        .min(3)
        .max(20)
        .required()
        .messages({
            'string.base': `"name" should be a type of 'text'`,
            'string.empty': `"name" cannot be empty`,
            'string.min': `"name" should have at least {#limit} characters`,
            'string.max': `"name" should have at most {#limit} characters`,
            'any.required': `"name" is a required field`
        }),
    phoneNumber: Joi.string()
        .min(3)
        .max(20)
        .pattern(phoneRegex)
        .required()
        .messages({
            'string.pattern.base': `"phoneNumber" must be a valid phone number (10–15 digits, optional +)`,
            'string.min': `"phoneNumber" should have at least {#limit} characters`,
            'string.max': `"phoneNumber" should have at most {#limit} characters`,
            'any.required': `"phoneNumber" is a required field`
        }),
    email: Joi.string()
        .min(3)
        .max(20)
        .email()
        .required()
        .messages({
            'string.email': `"email" must be a valid email address`,
            'string.min': `"email" should have at least {#limit} characters`,
            'string.max': `"email" should have at most {#limit} characters`,
            'any.required': `"email" is a required field`
        }),
    isFavourite: Joi.boolean(),
    contactType: Joi.string()
        .valid(...typeList)
        .min(3)
        .max(20)
        .required()
        .messages({
            'any.only': `"contactType" must be one of [film, serial]`,
            'any.required': `"contactType" is a required field`
        }),
});

export const contactUpdateSchema = Joi.object({
    name: Joi.string()
        .min(3)
        .max(20)
        .messages({
            'string.min': `"name" should have at least {#limit} characters`,
            'string.max': `"name" should have at most {#limit} characters`
        }),
    phoneNumber: Joi.string()
        .min(3)
        .max(20)
        .pattern(phoneRegex)
        .messages({
            'string.pattern.base': `"phoneNumber" must be a valid phone number (10–15 digits, optional +)`,
            'string.min': `"phoneNumber" should have at least {#limit} characters`,
            'string.max': `"phoneNumber" should have at most {#limit} characters`
        }),
    email: Joi.string()
        .min(3)
        .max(20)
        .email()
        .messages({
            'string.email': `"email" must be a valid email address`,
            'string.min': `"email" should have at least {#limit} characters`,
            'string.max': `"email" should have at most {#limit} characters`
        }),
    isFavourite: Joi.boolean(),
    contactType: Joi.string()
        .valid(...typeList)
        .min(3)
        .max(20)
        .messages({
            'any.only': `"contactType" must be one of [film, serial]`,
            'string.min': `"contactType" should have at least {#limit} characters`,
            'string.max': `"contactType" should have at most {#limit} characters`
        }),
});
