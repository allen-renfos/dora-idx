"use client";
import { profile } from "console";
import React, { createContext, useContext, useState } from "react";

export const NameContext = createContext({
  name: "",
  shortDescription: "",
  longDescription: "",
  company_logo: "",
  company_name: "",
  profile_image: "",
  email: "",
  phone: "",
  socialUrls: {
    facebook: "",
    instagram: "",
    twitter: "",
    linkedin: "",
    youtube: "",
    linked_in: "",
    email: "",
  },
  address: "",
  setName: (_name: string) => {},
  setShortDescription: (_desc: string) => {},
  setLongDescription: (_desc: string) => {},
  setSocialUrls: (_urls: any) => {},
  setCompanyLogo: (_logo: string) => {},
  setCompanyName: (_name: string) => {},
  setProfileImage: (_image: string) => {},
  setAddress: (_address: string) => {},
  setEmail: (_email: string) => {},
  setPhone: (_phone: string) => {},
});

export function useNameContext() {
  return useContext(NameContext);
}

export function NameProvider({ children }: { children: React.ReactNode }) {
  const [name, setName] = useState("Dora");
  const [shortDescription, setShortDescription] = useState("");
  const [longDescription, setLongDescription] = useState("");
  const [companyLogo, setCompanyLogo] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [socialUrls, setSocialUrls] = useState({
    facebook: "",
    instagram: "",
    twitter: "",
    linkedin: "",
    linked_in: "",
    youtube: "",
    email: "",
  });
  const [profileImage, setProfileImage] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  return (
    <NameContext.Provider
      value={{
        name,
        shortDescription,
        longDescription,
        company_logo: companyLogo,
        company_name: companyName,
        socialUrls,
        profile_image: profileImage,
        address,
        email,
        phone,
        setName,
        setShortDescription,
        setLongDescription,
        setSocialUrls,
        setCompanyLogo,
        setCompanyName,
        setProfileImage,
        setAddress,
        setEmail,
        setPhone,
      }}
    >
      {children}
    </NameContext.Provider>
  );
}
