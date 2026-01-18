import ContactIconInfo from "@/components/Footer/ContactIconInfo";
import { CircleSmall, Mail, PhoneCall } from "lucide-react";

export default function TermsAndConditions() {
  const sections = [
    {
      title: "Acceptance of Terms",
      subtitle: "By using our website, you agree to these terms.",
      details: [
        {
          heading: "Agreement:",
          text: "Accessing the site confirms your acceptance of our terms and conditions.",
        },
        {
          heading: "Eligibility:",
          text: "You must be at least 13 years old to use the website.",
        },
      ],
    },
    {
      title: "User Responsibilities",
      subtitle: "Users are responsible for their actions on the site.",
      details: [
        {
          heading: "Account Security:",
          text: "Keep your login credentials safe and do not share them.",
        },
        {
          heading: "Accurate Information:",
          text: "Provide accurate details when creating your family tree.",
        },
        {
          heading: "Content Ownership:",
          text: "You are responsible for the information and images you upload.",
        },
      ],
    },
    {
      title: "Privacy and Data",
      subtitle: "Your data is protected according to our privacy policy.",
      details: [
        {
          heading: "User Data:",
          text: "We collect and store your information to manage your family tree.",
        },
        {
          heading: "Sharing:",
          text: "You control which family branches and data are shared with others.",
        },
      ],
    },
    {
      title: "Prohibited Activities",
      subtitle: "Users must not misuse the website.",
      details: [
        {
          heading: "Illegal Content:",
          text: "Do not upload content that is illegal or infringes rights.",
        },
        {
          heading: "Harmful Actions:",
          text: "Avoid actions that could disrupt or damage the website or other users.",
        },
        {
          heading: "Impersonation:",
          text: "Do not impersonate others or create fake accounts.",
        },
      ],
    },
    {
      title: "Limitation of Liability",
      subtitle: "We are not responsible for certain issues.",
      details: [
        {
          heading: "Data Accuracy:",
          text: "We do not guarantee the accuracy of user-submitted information.",
        },
        {
          heading: "Service Interruptions:",
          text: "We are not liable for temporary downtime or technical issues.",
        },
        {
          heading: "Third-Party Links:",
          text: "We are not responsible for content on external websites linked from our site.",
        },
      ],
    },
    {
      title: "Modifications to Terms",
      subtitle: "We may update these terms occasionally.",
      details: [
        {
          heading: "Notification:",
          text: "Major changes will be communicated via the website or email.",
        },
        {
          heading: "Acceptance:",
          text: "Continued use of the site indicates your agreement to updated terms.",
        },
      ],
    },
  ];
  return (
    <div className="pad-x mx-auto my-8 w-full max-w-3xl space-y-6">
      <div className="text-center">
        <h1 className="font-bodoni text-3xl">Terms & Conditions</h1>
        <p className="text-foreground/65 text-sm">
          Rules and guidelines for using our Family Tree website.
        </p>
      </div>

      {sections.map((section, idx) => (
        <div key={idx} className="space-y-1">
          <h2 className="text-xl font-bold">{section.title}</h2>
          <p className="text-foreground/65 text-sm font-bold">
            {section.subtitle}
          </p>
          <div className="space-y-1">
            {section.details.map((detail, i) => (
              <p key={i} className="text-foreground/75 ps-2 text-sm">
                <CircleSmall className="mr-1 inline-block size-2 stroke-3" />
                <span className="font-medium">{detail.heading} </span>
                {detail.text}
              </p>
            ))}
          </div>
        </div>
      ))}

      {/* Contact Info */}
      <div className="mt-10 flex flex-wrap justify-center gap-4 sm:gap-12">
        <ContactIconInfo
          className=""
          text="Contact (WhatsApp)"
          head="+92 342 3873626"
          textClass="text-foreground"
          headClass="text-primary"
          iconClass="text-primary"
          circleClass="bg-primary"
          Icon={PhoneCall}
        />

        {/* Email  */}
        <ContactIconInfo
          className=""
          text="Email"
          head="hzubair717@gmail.com"
          textClass="text-foreground"
          headClass="text-primary"
          iconClass="text-primary"
          circleClass="bg-primary"
          Icon={Mail}
        />
      </div>
    </div>
  );
}
