import { LegalPage } from "@/component/ui/LegalPage";

export default function TermsOfServicePage() {
  return (
    <LegalPage
      active=""
      eyebrow="Legal"
      title="DMCA & Terms of Service"
    >
      <h2>1. Property Ownership &amp; Copyright</h2>
      <p>
        All content displayed on this website, including text, graphics, logos,
        images, design elements, software, and IDX integration technology, is
        the property of the website owner, the affiliated real estate
        brokerage, Realtipro, or the applicable Multiple Listing Service (MLS),
        and is protected by United States copyright laws.
      </p>

      <h2>2. IDX Data Usage</h2>
      <p>
        Property listing data displayed through Internet Data Exchange (IDX) is
        provided by participating MLS organizations and is subject to MLS rules
        and copyright protections. Listing information is intended for
        personal, non-commercial use by consumers interested in purchasing or
        selling real estate and may not be copied, reproduced, redistributed,
        or used for any commercial purpose without prior written consent.
      </p>

      <h2>3. DMCA Notice</h2>
      <p>
        If you believe that content on this website infringes your copyright,
        you may submit a written notification including: (1) identification of
        the copyrighted work claimed to be infringed, (2) identification of the
        material that is claimed to be infringing and its location on the
        website, (3) your contact information, (4) a statement that you have a
        good faith belief that the disputed use is not authorized, and (5) a
        statement made under penalty of perjury that the information in your
        notice is accurate and that you are the copyright owner or authorized
        to act on behalf of the owner.
      </p>
      <p>
        DMCA notices should be sent to:
        <br />
        RealtiPro Corp
        <br />
        22722 29th DR SE, STE 100
        <br />
        Bothell, 98021
      </p>
      <p>
        By email:{" "}
        <a href="mailto:info@realtipro.com">info@realtipro.com</a>
      </p>
      <p>
        Upon receipt of a valid DMCA notice, we will investigate and remove or
        disable access to the allegedly infringing material as required by law.
      </p>
    </LegalPage>
  );
}
