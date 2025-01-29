# PrivateID Verified Identity – PreBuilt Webpages

Welcome to the **PrivateID Verified Identity** repository! This project houses front-end code for **pre-built web pages**—developed in **React.js**, **Material UI**, and **TypeScript**—that showcase how to integrate **PrivateID**’s homomorphic tokenization-based **Ultrapass Authenticator** into your applications. 

The **Ultrapass Authenticator** is a comprehensive identity solution supporting:
- **Registration** (biometric capture and secure user onboarding)
- **Passwordless Authentication** (eliminates traditional passwords with token-based verification)
- **Face Age Estimation** (age checks to ensure compliance or user gating)
- **Ultrapass MediaSafe** (a hosted video pipeline for secure media recording and verification)

Depending on your requirements, you can deploy these capabilities in multiple ways:
- As **downloadable software** on mobile devices (iOS/Android apps)
- As a fully managed **SaaS** hosted by PrivateID
- As a **PaaS** in your own infrastructure (self-hosted or private cloud)
- Embedded in a webpage via **WebAssembly**, with **white-label** options to fit your brand

---

## Table of Contents

1. [Ultrapass Authenticator Introduction](#ultrapass-authenticator-introduction)
2. [Introduction to PrivateID Services](#introduction-to-privateid-services)
   - [PrivateID Downloadable Software Services](#privateid-downloadable-software-services)
   - [PrivateID Online and SaaS Services](#privateid-online-and-saas-services)
3. [Repository Overview](#repository-overview)
   - [Environment Variables](#environment-variables)
   - [Configuration](#configuration)
4. [Using the Ultrapass Authenticator in Different Deployment Models](#using-the-ultrapass-authenticator-in-different-deployment-models)
   - [Mobile Apps (Downloadable Software)](#mobile-apps-downloadable-software)
   - [Backend as SaaS (Hosted by PrivateID)](#backend-as-saas-hosted-by-privateid)
   - [Backend as PaaS (Self-Hosted)](#backend-as-paas-self-hosted)
   - [WebAssembly Integration (Browser-Based)](#webassembly-integration-browser-based)
   - [White Labeling](#white-labeling)
5. [How to Use PrivateID Software (General Guidance)](#how-to-use-privateid-software-general-guidance)
   - [Register](#register)
   - [Passwordless Authentication](#passwordless-authentication)
   - [Face Age Estimation](#face-age-estimation)
   - [Ultrapass MediaSafe Hosted Video Pipeline](#ultrapass-mediasafe-hosted-video-pipeline)
   - [Attended vs. Unattended Use](#attended-vs-unattended-use)
6. [Technical Explanation of PrivateID Homomorphic Tokenization](#technical-explanation-of-privateid-homomorphic-tokenization)
   - [1. Introduction](#1-introduction)
   - [2. Background and Motivation](#2-background-and-motivation)
   - [3. Core Concept: Homomorphic Tokenization Technology](#3-core-concept-homomorphic-tokenization-technology)
   - [4. Advantages Over Conventional Biometric Solutions](#4-advantages-over-conventional-biometric-solutions)
   - [5. Security Framework and Cryptographic Layers](#5-security-framework-and-cryptographic-layers)
   - [6. Empirical Validation and Independent Testing](#6-empirical-validation-and-independent-testing)
   - [7. Alignment with International Standards](#7-alignment-with-international-standards)
   - [8. Technical Benefits](#8-technical-benefits)
   - [9. Future Research and Extensions](#9-future-research-and-extensions)
   - [10. Conclusion](#10-conclusion)
   - [11. References](#11-references)
7. [Architecture Diagram](#architecture-diagram)
8. [License / Further Information](#license--further-information)

---

## Ultrapass Authenticator Introduction

The **Ultrapass Authenticator** provides a comprehensive solution for identity verification that leverages **homomorphic tokenization**, ensuring privacy and security at scale. Core features include:

1. **Secure User Registration**  
   - Users enroll by capturing biometric data (e.g., face, voice).  
   - All captured data is instantly transformed into **homomorphic tokens** on the device, so no raw biometric ever leaves the user’s device unencrypted.

2. **Passwordless Authentication**  
   - Eliminates traditional passwords, reducing risk of credential theft or phishing.  
   - Users simply present their biometric (face or voice) or use the on-device token to authenticate.

3. **Face Age Estimation**  
   - Confirms if a user is above a certain age threshold (e.g., 18+)—essential for regulated industries or content gating.  
   - Runs quickly on-device or server-side, protecting raw images with the same homomorphic tokenization approach.

4. **Ultrapass MediaSafe (Hosted Video Pipeline)**  
   - A secure end-to-end pipeline for recording and storing video evidence (e.g., identity-proofing sessions, liveness checks, additional user verification steps).  
   - Preserves privacy by encrypting data in transit and at rest, ensuring compliance with data protection laws.

---

## Introduction to PrivateID Services

**PrivateID** is the overarching platform behind the Ultrapass Authenticator. Here’s how the broader **PrivateID** service offerings map to typical enterprise or developer needs:

### PrivateID Downloadable Software Services

1. **Downloadable Computer Software for Biometric Identification**  
   - Software utilities, SDKs, or modules that can be installed on devices, self-check-in kiosks, or servers.  
   - Manages biometric capture, liveness checks, and token creation.

2. **Biometric Identification Apparatus**  
   - Hardware and sensor packages optimized for the PrivateID ecosystem.  
   - Ensures high-fidelity biometric capture, further reducing error rates and false matches.

3. **Downloadable Computer Programs for Identity Control, Verification, and Enrollment**  
   - Empowers organizations to embed biometrics directly into user onboarding.  
   - Offers robust identity checks for compliance or fraud prevention.

4. **Downloadable Computer Software for Authenticated Identity, Credentials, and Documentation Management**  
   - Adds a layer of secure credential storage on user devices or enterprise servers.  
   - Facilitates multi-factor or biometric-based decryption and access control.

### PrivateID Online and SaaS Services

1. **User Authentication Technology Services**  
   - PrivateID’s secure servers verify user tokens and identity.  
   - Also supports multi-factor flows combining biometrics and passcodes/hardware tokens.

2. **Biometric Authentication & Identity Verification for E-Commerce**  
   - Ideal for checkout flows that need stronger identity proofing or frictionless re-authentication.  
   - Helps reduce cart abandonment while enhancing security.

3. **Software-as-a-Service (SaaS) for Issuing & Managing Identity Credentials**  
   - Streamlines credential lifecycle: issuance, revocation, renewal, and secure storage.  
   - Compliant with data privacy regulations like GDPR, CCPA, HIPAA, BIPA, etc.

4. **Computer Security Services for Centralized Identity Management**  
   - Scalable 1:N or “1:few” matching (e.g., deduplication for large user databases).  
   - Enterprise-friendly features like admin dashboards, analytics, and user provisioning.

5. **Application Service Provider (API) & Platform-as-a-Service (PaaS)**  
   - Modular APIs for implementing tokenization, verification, searching, and more within your environment.  
   - Deploy to your private cloud or on-premises infrastructure.

6. **Online Non-Downloadable Software (Web Portals, On-Demand Apps)**  
   - Provides immediate access to PrivateID features via web browsers.  
   - Zero install overhead for end-users, suitable for quick user registration or identity proofing.

---

## Repository Overview

This **GitHub** repository contains:

- **Pre-built Web Pages** (written with React.js, Material UI, and TypeScript):
  - Live instance at [https://cams.ultrapass.id/](https://cams.ultrapass.id/).
  - Integrate these pages into your own site for out-of-the-box identity verification workflows, or use them as a starting point for deeper customization.

- **React.js & Node.js/Express Code Examples**:
  - Demonstrates best practices for calling the Ultrapass Authenticator’s backend endpoints.  
  - Shows server-side logic for issuing verification sessions, handling callbacks, and retrieving results.

### Environment Variables

An `env.example` file is provided to illustrate the environment variables required. For local development or deployment:

1. Copy `env.example` to `.env`:
   ```bash
   cp env.example .env


