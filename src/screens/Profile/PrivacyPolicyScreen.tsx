import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Typography } from "../../theme/Colors";

const PrivacyPolicyScreen = () => {
  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.titlestyle}>Privacy Policy</Text>
        <Text style={styles.contentstyle}>
          At Snapshop, we are fully committed to respecting and protecting your
          privacy because we understand the importance of safeguarding your
          personal information when you use our mobile application, website, or
          related services. This Privacy Policy outlines in clear terms how we
          collect, use, store, share, and protect your data when you engage with
          our platform, and by continuing to use our services, you explicitly
          agree to the practices described herein. When you register for an
          account, place an order, subscribe to our newsletter, contact customer
          service, participate in promotions, or interact with any features
          within the app or website, we may collect a wide range of personally
          identifiable information, including but not limited to your full name,
          email address, mobile number, billing and shipping addresses, payment
          method details, date of birth, gender, and demographic preferences.
          Additionally, we automatically collect device and technical
          information such as your IP address, geolocation data (if permitted),
          operating system, browser type, screen resolution, access time, page
          views, session duration, crash logs, app activity, and referral URLs
          to help us optimize your experience and ensure system integrity. All
          payment transactions are securely processed via third-party gateways
          that comply with industry standards such as PCI-DSS and do not store
          full credit or debit card details on our servers. We use your data to
          process orders, facilitate delivery, confirm payments, offer customer
          support, personalize product recommendations, conduct internal
          analytics, improve our app interface and website functionality, detect
          and prevent fraud, send updates and service notifications, run
          advertising campaigns, and comply with any applicable legal or
          regulatory requirements. We may send promotional messages,
          newsletters, or special offers via email, SMS, or push notifications,
          which you can opt out of at any time. We never sell or rent your
          personal information to third parties. However, we may share your data
          with trusted third-party service providers such as logistics
          companies, cloud hosting partners, marketing and advertising platforms
          (like Google Ads or Facebook Pixel), and data analytics tools who help
          us in the operation of our business, all under strict confidentiality
          and data processing agreements. We may also disclose your data to law
          enforcement or government agencies where required by law, legal
          process, or in response to valid requests related to criminal
          investigations or national security. Our platform uses cookies, web
          beacons, and similar tracking technologies to recognize repeat users,
          save login preferences, analyze traffic patterns, and display relevant
          advertisements, and you may control cookie settings through your
          browser or device. We take data security seriously and use advanced
          security measures including SSL encryption, firewalls, access control
          policies, regular vulnerability assessments, and secure server
          environments to protect your information; however, no online service
          can guarantee absolute security, so we urge users to create strong
          passwords and not share login credentials. If you choose to log in via
          third-party services like Google or Apple ID, we may receive limited
          data as permitted under their policies and only use it for account
          creation and authentication purposes. You have full rights over your
          data, including the right to access, correct, download, restrict,
          object to, or delete your personal information, which can be done
          through your account settings or by contacting our privacy officer. If
          you reside in the European Economic Area (EEA), you have rights under
          the General Data Protection Regulation (GDPR), and if you live in
          California, USA, you may exercise your rights under the California
          Consumer Privacy Act (CCPA), including the right to know what data we
          collect, the right to delete your data, and the right to opt-out of
          the sale of personal information, even though we do not engage in such
          practices. Our services are intended only for users aged 13 years and
          older; we do not knowingly collect or process personal data from
          minors without parental consent, and if we learn that we have
          inadvertently obtained such information, we will immediately delete it
          from our records. Our privacy practices may evolve over time due to
          changes in technology, legal requirements, or business operations, and
          we reserve the right to update this Privacy Policy at our discretion.
          When changes occur, we will update the “Effective Date” at the top of
          this page and may notify users through in-app alerts, emails, or
          platform announcements as appropriate. Your continued use of our
          services after such modifications constitutes your acceptance of the
          updated policy. If you have any questions about this Privacy Policy,
          your rights, or our data handling practices, or if you wish to file a
          complaint, please do not hesitate to contact our Data Protection
          Officer or support team at Test@gmail.com, call us at +917854785600 , We
          are committed to resolving any issues promptly and transparently to
          ensure that your data and privacy are always treated with the highest
          level of care and respect.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    // flexDirection: "row",
    justifyContent: "center",
    padding: 10,
    flex: 1,
    color: Typography.Colors.white,
  },
  titlestyle: {
    alignSelf: "center",
    marginBottom: 10,
    color: Typography.Colors.red,
    fontFamily: Typography.font.bold,
    fontSize: 24,
    fontWeight: "bold",
  },
  contentstyle: {
    textAlign: "center",
    color: Typography.Colors.lightgrey,
    fontFamily: Typography.font.regular,
    fontSize: 16,
    fontWeight: "600",
  },
});

export default PrivacyPolicyScreen;
