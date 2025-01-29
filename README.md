# PrivateID Verified Identity – PreBuilt Webpages

Welcome to the **PrivateID Verified Identity** repository! This project houses front-end code for **pre-built web pages**—developed in **React.js**, **Material UI**, and **TypeScript**—that showcase how to integrate **PrivateID**’s homomorphic tokenization-based **Ultrapass Authenticator** into your applications.

The **Ultrapass Authenticator** is a comprehensive identity solution supporting:

- **Registration** (biometric capture and secure user onboarding)
- **Passwordless Authentication** (eliminates passwords with secure, on-device tokenization)
- **Face Age Estimation** (age checks to ensure compliance or content gating)
- **Ultrapass MediaSafe** (hosted video pipeline for secure media recording and verification)
- **Photo ID Scanning & Comparison** (capture driver’s license, passport, or other IDs; compare the portrait to the user on-device)
- **Extended IDV Services** with **IDEMIA** (document authenticity and identity verification)
- **Unattended Biometric Access Control** for physical security (doors, turnstiles, and kiosks)

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
   - [Installing and Running Locally](#installing-and-running-locally)
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
   - [Unattended Biometric Access Control](#unattended-biometric-access-control)
   - [Attended vs. Unattended Use](#attended-vs-unattended-use)
6. [Technical Explanation of PrivateID Homomorphic Tokenization](#technical-explanation-of-privateid-homomorphic-tokenization)
7. [Architecture Diagram](#architecture-diagram)
8. [License / Further Information](#license--further-information)

---

## Ultrapass Authenticator Introduction

The **Ultrapass Authenticator** is a multi-faceted identity verification platform that leverages **homomorphic tokenization** to ensure privacy and security at scale.

### Key Features:

1. **Secure User Registration**
   - Capture and tokenize biometric data (e.g., face, voice) during enrollment.
   - All raw data is immediately converted into **homomorphic tokens** on the user’s device.
2. **Passwordless Authentication**
   - Eliminates passwords, preventing phishing and credential stuffing attacks.
3. **Face Age Estimation**
   - Quickly determines if a user meets a required age threshold (e.g., 18+).
4. **Ultrapass MediaSafe (Hosted Video Pipeline)**
   - Provides a secure pipeline for video evidence capturing, encrypting all transmissions.
5. **Photo ID Scanning & Comparison**
   - Scans and verifies government-issued IDs against real-time facial capture.
6. **Partnership with IDEMIA for IDV**
   - Extends document authenticity checks for greater verification security.
7. **Unattended Biometric Access Control**
   - Enables frictionless entry into physical facilities using biometrics.

---

## Introduction to PrivateID Services

### PrivateID Downloadable Software Services

- **Biometric Identification Software**
- **Downloadable Identity Control & Enrollment Software**
- **Identity Credential & Documentation Management Software**

### PrivateID Online and SaaS Services

- **User Authentication Technology Services**
- **Biometric Authentication for E-Commerce**
- **Software-as-a-Service (SaaS) for Identity Credential Management**
- **Computer Security for Identity Management**
- **Platform-as-a-Service (PaaS) & API Solutions**

---

## Repository Overview

### Environment Variables

Use the `env.example` file to configure:

```bash
cp env.example .env
```

Modify `.env` with your PrivateID API key:

```bash
REACT_APP_API_KEY=YOUR_PRIVATEID_API_KEY
```

### Installing and Running Locally

Install dependencies:

```bash
npm install
```

Start development server:

```bash
npm run start
```

Build for production:

```bash
npm run build
```

Serve production build:

```bash
serve -s build
```

---

## Technical Explanation of PrivateID Homomorphic Tokenization

### Core Concept:

- **One-Way Mapping:** Converts biometric data into high-entropy vectors.
- **Encrypted Operations:** Tokens retain structure for matching but cannot be reversed.
- **Token Properties:** Keyless, anonymized, irreversible, small in footprint (1KB–16KB).

### Security & Cryptographic Layers:

- **Hybrid PKI & Time Salts** prevent replay attacks.
- **Quantum-Resistant Cryptography** ensures future-proof security.
- **Immutable C++ Container** secures token generation and matching.

---

## Architecture Diagram

```text
[ User Device / Kiosk / Physical Access Point ]
   (Ultrapass Authenticator app or WebAssembly UI)
                 |
                 | (Captures Biometric/ID, creates Homomorphic Token)
                 v
 [ Node.js / Express / K8s Microservice (SaaS or PaaS) ]
     (Session key management, ID scanning, 
  integration with IDEMIA IDV, token-based verification)
                 |
                 v
   [ PrivateID Vector Database & Matching Engine ]
   (Approximate Nearest Neighbor / "1:few" search)
```

---

## License / Further Information

- **License:** Refer to the `LICENSE` file for terms.
- **Support:** For integration assistance, contact PrivateID or open a GitHub Issue.
- **Further Documentation:** Available upon request, including advanced kiosk hardware and IoT access control integrations.

**Thank you for using the Ultrapass Authenticator by Private Identity!** 🎉
