# Ultrapass Verified Identity by PrivateID – PreBuilt Webpages

Welcome to the **Ultrapass Verified Identity** repository! This project houses front-end code for **pre-built web pages**—developed in **React.js**, **Material UI**, and **TypeScript**—that showcase how to integrate **Ultrapass**’s homomorphic tokenization-based **Ultrapass Authenticator** into your applications. 

The **Ultrapass Authenticator** is a comprehensive identity solution supporting:
- **Registration** (biometric capture and secure user onboarding)
- **Passwordless Authentication** (eliminates traditional passwords with token-based verification)
- **Face Age Estimation** (age checks to ensure compliance or user gating)
- **Ultrapass MediaSafe** (a hosted video pipeline for secure media recording and verification)

Depending on your requirements, you can deploy these capabilities in multiple ways:
- As **downloadable software** on mobile devices (iOS/Android apps)
- As a fully managed **SaaS** hosted by Ultrapass
- As a **PaaS** in your own infrastructure (self-hosted or private cloud)
- Embedded in a webpage via **WebAssembly**, with **white-label** options to fit your brand

---

## Table of Contents

1. [Ultrapass Authenticator Introduction](#ultrapass-authenticator-introduction)
2. [Introduction to Ultrapass Services](#introduction-to-Ultrapass-services)
   - [Ultrapass Downloadable Software Services](#Ultrapass-downloadable-software-services)
   - [Ultrapass Online and SaaS Services](#Ultrapass-online-and-saas-services)
3. [Repository Overview](#repository-overview)
   - [Environment Variables](#environment-variables)
   - [Configuration](#configuration)
4. [Using the Ultrapass Authenticator in Different Deployment Models](#using-the-ultrapass-authenticator-in-different-deployment-models)
   - [Mobile Apps (Downloadable Software)](#mobile-apps-downloadable-software)
   - [Backend as SaaS (Hosted by Ultrapass)](#backend-as-saas-hosted-by-Ultrapass)
   - [Backend as PaaS (Self-Hosted)](#backend-as-paas-self-hosted)
   - [WebAssembly Integration (Browser-Based)](#webassembly-integration-browser-based)
   - [White Labeling](#white-labeling)
5. [How to Use Ultrapass Software (General Guidance)](#how-to-use-Ultrapass-software-general-guidance)
   - [Register](#register)
   - [Passwordless Authentication](#passwordless-authentication)
   - [Face Age Estimation](#face-age-estimation)
   - [Ultrapass MediaSafe Hosted Video Pipeline](#ultrapass-mediasafe-hosted-video-pipeline)
   - [Attended vs. Unattended Use](#attended-vs-unattended-use)
6. [Technical Explanation of Ultrapass Homomorphic Tokenization](#technical-explanation-of-Ultrapass-homomorphic-tokenization)
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

## Introduction to Ultrapass Services

**Ultrapass** is the overarching platform behind the Ultrapass Authenticator. Here’s how the broader **Ultrapass** service offerings map to typical enterprise or developer needs:

### Ultrapass Downloadable Software Services

1. **Downloadable Computer Software for Biometric Identification**  
   - Software utilities, SDKs, or modules that can be installed on devices, self-check-in kiosks, or servers.  
   - Manages biometric capture, liveness checks, and token creation.

2. **Biometric Identification Apparatus**  
   - Hardware and sensor packages optimized for the Ultrapass ecosystem.  
   - Ensures high-fidelity biometric capture, further reducing error rates and false matches.

3. **Downloadable Computer Programs for Identity Control, Verification, and Enrollment**  
   - Empowers organizations to embed biometrics directly into user onboarding.  
   - Offers robust identity checks for compliance or fraud prevention.

4. **Downloadable Computer Software for Authenticated Identity, Credentials, and Documentation Management**  
   - Adds a layer of secure credential storage on user devices or enterprise servers.  
   - Facilitates multi-factor or biometric-based decryption and access control.

### Ultrapass Online and SaaS Services

1. **User Authentication Technology Services**  
   - Ultrapass’s secure servers verify user tokens and identity.  
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
   - Provides immediate access to Ultrapass features via web browsers.  
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

2. Edit `.env` to include your PrivateID API key:

```
REACT_APP_API_KEY=YOUR_PRIVATEID_API_KEY
```

**Security Caution:** Never commit real API keys or `.env` files to source control.

## Configuration

Adjust `src/config.ts` to tailor the verification process:

- **Session Expiry:** How long a session remains valid.
- **Callback URLs:** Endpoints for asynchronous events (e.g., once a user finishes capture).
- **Branding & Theme:** Modify visual styling, color schemes, brand logos, disclaimers.
- **Biometric Options:** Enable or disable specific flows (face, voice, ID scanning, age checks).

## Using the Ultrapass Authenticator in Different Deployment Models

### Mobile Apps (Downloadable Software)

- **Platforms:** iOS, Android  
- **Install:** Publish on public app stores or use enterprise distribution.  
- **Core Features:** Registration, face/voice capture, passwordless login, face age checks, ID scanning, short video capture for MediaSafe, biometric access control integration.  
- **Offline Mode:** Basic tasks can function without an active connection; data securely syncs once online.  

#### Advantages

- Exploits native device hardware (high-resolution cameras, specialized sensors).
- Ideal for recurring use (e.g., employees clocking in, online banking logins).
- Compatibility with device-level security (Touch ID, Face ID) for multi-factor setups.

### Backend as SaaS (Hosted by PrivateID)

- **Fully Managed:** PrivateID handles hosting, scaling, system updates, and compliance.
- **Rapid Onboarding:** Fast deployment with minimal DevOps overhead.
- **High Availability:** SLAs for uptime and reliability.
- **Usage:** The pre-built React pages connect to PrivateID’s SaaS endpoints by default. Integrate via REST/GraphQL with your own front end.

#### Advantages

- Simplifies infrastructure management—focus on your core product.
- Security patches and updates are automatically provided by PrivateID.
- Quick pilot deployments and trials with minimal lead time.

### Backend as PaaS (Self-Hosted)

- **Infrastructure Control:** Install PrivateID services in your Kubernetes cluster or on bare-metal servers.
- **Customized Environment:** Maintain your own logs, data retention policies, and scaling strategies.
- **Regional Compliance:** Ensure data residency requirements are met by hosting in specific geographic locations.

#### Advantages

- Greater autonomy and customization for unique business needs.
- Seamless integration with existing identity infrastructure.
- On-premises or private cloud options for strict regulatory scenarios.

### WebAssembly Integration (Browser-Based)

- **Client-Side Tokenization:** Convert raw biometric or ID data into tokens without sending unencrypted data.
- **Frictionless:** Users only need a modern browser, no app installation necessary.
- **Performant:** Near-native speed for real-time captures and checks.

#### Advantages

- Zero installation overhead.
- Maintains strong data protection from the user’s browser to your servers.
- Ideal for “lightweight” identity verifications on public websites or corporate portals.

## White Labeling

- **Custom Branding:** Replace default visuals with your own logo, color schemes, and domain.
- **Consistent UX:** Your end-users see a seamless interface from start to finish.
- **Flexibility:** Add disclaimers, instructions, or localized text relevant to your audience.

#### Advantages

- Enhanced brand trust—users remain in a familiar environment.
- Integrate disclaimers or legal text specific to your jurisdiction/industry.
- Complete visual control.

## How to Use PrivateID Software (General Guidance)

### Register

#### Biometric Capture & Tokenization

- User grants consent for camera or microphone usage.
- The device processes the data into a homomorphic token locally.

#### Server-Side Registration

- The token is transmitted to the PrivateID service (SaaS or PaaS).
- A new user record is created if it doesn’t already exist.

#### Confirmation

- The server returns a unique user ID (GUID).
- No raw biometrics or unencrypted data are stored.

### Passwordless Authentication

#### Biometric Prompt

- The user is prompted for a fresh capture (face, voice, or other).
- The system can also use stored tokens if a device has secure local token caching.

#### Token Submission

- A newly generated token is submitted to PrivateID for matching.
- Matching can be 1:1 (user known) or 1:few (small candidate set) or full 1:N (large-scale identification).

#### Access Granted

- If the token matches, an authentication session or JWT is issued.
- Eliminates the reliance on passwords, drastically reducing phishing or credential leaks.

## Face Age Estimation

### On-Device Model

- The age model runs locally to estimate if the user meets a threshold (18+, 21+).
- This estimate is appended (in token form) to the user’s session data.

### Regulatory & Compliance Use Cases

- Bars e-commerce transactions if age criteria fail.
- Reduces the risk of servicing underage users in restricted scenarios (e.g., gambling, alcohol sales).

### Immediate Discard

- The raw video/image is not stored. Only the token or the “age pass/fail” result is transmitted.

## License / Further Information

- **License:** Refer to the LICENSE file for usage terms.
- **Contribution Guidelines:** We welcome pull requests and issue submissions to improve or extend these code examples.
- **Support:** For troubleshooting, integration assistance, or general questions, contact PrivateID Support or open a GitHub Issue.
- **Further Documentation:** Detailed developer guides, deployment scripts, and advanced integrations (including kiosk hardware or IoT access control setups) are available upon request.

Thank you for using the Ultrapass Authenticator by Private Identity! We strive to make biometric security private, fast, and highly adaptable for both digital and physical access scenarios. If you have any questions or need more information, please visit our GitHub Issues page or contact PrivateID directly.

