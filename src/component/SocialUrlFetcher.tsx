"use client";
import { useEffect } from "react";
import { useNameContext } from "./NameProvider";
import { useSocialData } from "@/services/auth/AuthQueries";

export default function SocialUrlFetcher() {
  const setters = useNameContext();
  const { data } = useSocialData();

  useEffect(() => {
    if (!data) return;
    if (data.name) setters.setName(data.name);
    if (data.short_description) setters.setShortDescription(data.short_description);
    if (data.long_description) setters.setLongDescription(data.long_description);
    if (data.social_urls) setters.setSocialUrls(data.social_urls);
    if (data.company_logo) setters.setCompanyLogo(data.company_logo.replace("/xs/", "/original/"));
    if (data.company_name || data.company) setters.setCompanyName(data.company_name || data.company);
    if (data.profile_image || data.photo) setters.setProfileImage(data.profile_image || data.photo);
    if (data.address) setters.setAddress(data.address);
    if (data.email) setters.setEmail(data.email);
    if (data.phone) setters.setPhone(data.phone);
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}
