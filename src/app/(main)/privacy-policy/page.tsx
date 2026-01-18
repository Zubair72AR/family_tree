import ContactIconInfo from "@/components/Footer/ContactIconInfo";
import { CircleSmall, Mail, PhoneCall } from "lucide-react";

export default function PrivacyPolicy() {
  const sections = [
    {
      title: "Information We Collect",
      subtitle: "We collect basic details to build your family tree.",
      details: [
        {
          heading: "Personal Information:",
          text: "Name, date of birth, gender, and profile photo.",
        },
        {
          heading: "Family Relations:",
          text: "Parent, spouse, children connections for tree visualization.",
        },
        {
          heading: "Account Data:",
          text: "Email, password, and login credentials for secure access.",
        },
      ],
    },
    {
      title: "How We Use Your Data",
      subtitle: "Your information is used only to enhance your experience.",
      details: [
        {
          heading: "Family Tree Management:",
          text: "To display relationships and histories correctly.",
        },
        {
          heading: "Account Management:",
          text: "For authentication, notifications, and user support.",
        },
        {
          heading: "Analytics:",
          text: "To improve the website and understand usage patterns.",
        },
      ],
    },
    {
      title: "Data Sharing and Disclosure",
      subtitle:
        "We respect your privacy and do not share your data without consent.",
      details: [
        {
          heading: "With Other Users:",
          text: "Only shared if you explicitly share a family branch.",
        },
        {
          heading: "Third-Party Services:",
          text: "Limited to payment gateways or email services, if applicable.",
        },
        {
          heading: "Legal Requirements:",
          text: "May share data only if required by law.",
        },
      ],
    },
    {
      title: "Data Security",
      subtitle:
        "We implement strict security measures to protect your information.",
      details: [
        {
          heading: "Encryption:",
          text: "Sensitive data is encrypted during storage and transmission.",
        },
        {
          heading: "Access Control:",
          text: "Only authorized personnel can access user data.",
        },
        {
          heading: "Regular Monitoring:",
          text: "Systems are monitored for suspicious activities.",
        },
      ],
    },
    {
      title: "User Control and Rights",
      subtitle: "You have control over your information and family tree data.",
      details: [
        {
          heading: "Edit or Delete Data:",
          text: "You can update or remove your profiles anytime.",
        },
        {
          heading: "Share Control:",
          text: "Decide which family branches are shared with others.",
        },
        {
          heading: "Account Deletion:",
          text: "Full account removal deletes associated personal data.",
        },
      ],
    },
    {
      title: "Cookies and Tracking",
      subtitle: "We use cookies to improve your browsing experience.",
      details: [
        {
          heading: "Functional Cookies:",
          text: "To maintain login sessions and tree navigation.",
        },
        {
          heading: "Analytics Cookies:",
          text: "Collect anonymous usage data for website improvement.",
        },
      ],
    },
    {
      title: "Changes to Privacy Policy",
      subtitle: "We may update this policy occasionally to reflect changes.",
      details: [
        {
          heading: "Notification:",
          text: "Major changes will be communicated via email or website notice.",
        },
        {
          heading: "Consent:",
          text: "Continued use of the site implies acceptance of updates.",
        },
      ],
    },
  ];

  return (
    <div className="pad-x mx-auto my-8 w-full max-w-3xl space-y-6">
      <div className="text-center">
        <h1 className="font-bodoni text-3xl">Privacy Policy</h1>
        <p className="text-foreground/65 text-sm">
          Protecting your family data and personal information securely.
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
