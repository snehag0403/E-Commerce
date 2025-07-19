import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Typography } from "../../theme/Colors";

const TermsnConditionScreen = () => {
  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.titlestyle}>Terms and Conditions</Text>
        <Text style={styles.contentstyle}>
          By accessing and using Snapshop, including all services, products,
          content, and features made available through our mobile application
          and website, you agree to be bound by these Terms and Conditions,
          which constitute a legally binding agreement between user and
          KeymouseIT Pvt. Ltd. These terms govern your access to and use of our
          platform, including account creation, browsing, purchasing, payments,
          delivery, returns, customer support, and all related functionalities.
          You represent that you are at least 18 years old or the age of legal
          majority in your jurisdiction, and that you have the legal authority
          to enter into this agreement. If you are using the platform on behalf
          of a company, organization, or other legal entity, you confirm that
          you have the authority to bind that entity to these terms. You agree
          to provide accurate, current, and complete information when creating
          your user account and to keep your login credentials secure and
          confidential. You are solely responsible for all activities that occur
          under your account and must notify us immediately of any unauthorized
          use or breach of security. The content, logos, images, product
          listings, designs, trademarks, and other intellectual property
          displayed on the platform are the sole property of KeymouseIT Pvt Ltd
          or its licensors, and may not be copied, reproduced, distributed,
          modified, or used in any form without our prior written consent. You
          agree not to misuse the platform, upload malicious code, interfere
          with normal operation, engage in fraudulent transactions, or violate
          any applicable laws while using our services. All product
          descriptions, prices, and availability are subject to change without
          notice. While we strive for accuracy, we do not guarantee that product
          descriptions or other content on the app is error-free. Orders may be
          refused or canceled at our sole discretion, especially in cases of
          pricing errors, suspected fraud, or stock unavailability. By placing
          an order, you authorize us to charge your selected payment method for
          the total amount including taxes, shipping, and handling fees where
          applicable. Delivery times are estimates and may vary based on
          location, courier service, and external factors beyond our control.
          You may request returns or refunds in accordance with our Return &
          Refund Policy, which is incorporated by reference into these Terms. We
          reserve the right to change or discontinue any part of the service at
          any time, temporarily or permanently, with or without notice, and we
          are not liable to you or any third party for any such modification,
          suspension, or discontinuation. From time to time, we may provide
          discount codes, vouchers, or promotional offers, all of which may be
          subject to additional terms and restrictions and may be withdrawn at
          any time without prior notice. Our services may include links or
          integrations to third-party websites or services, and we are not
          responsible for the availability, content, or privacy practices of
          those external sites. To the fullest extent permitted by law, we
          disclaim all warranties, express or implied, related to the use of our
          platform, including but not limited to merchantability, fitness for a
          particular purpose, and non-infringement. Under no circumstances shall
          KeymouseIT Pvt Ltd, its affiliates, directors, employees, or agents be
          liable for any indirect, incidental, punitive, or consequential
          damages arising out of your use or inability to use the platform, even
          if we have been advised of the possibility of such damages. Your sole
          and exclusive remedy for dissatisfaction is to stop using the service
          and delete your account. You agree to indemnify and hold harmless
          KeymouseIT Pvt Ltd and its affiliates from any claims, damages, or
          expenses resulting from your use of the platform, your violation of
          these terms, or your infringement of any third-party rights. These
          Terms shall be governed by and construed in accordance with the laws
          of Punjab,India, and any disputes shall be subject to the exclusive
          jurisdiction of the courts in Indian Jurisdiction. We may revise these
          Terms at any time by updating this page or notifying users through the
          app, and your continued use of the platform after such changes
          constitutes your acceptance of the updated terms. If any provision of
          these Terms is held invalid or unenforceable, the remaining provisions
          will remain in full force and effect. For any questions, concerns, or
          legal notices regarding these Terms and Conditions, please contact us
          at Test@gmail.com, call +91-7854856900. We appreciate your trust in Snapshop 
          and look forward to serving you.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flex: 1,
    color: Typography.Colors.white,
  },
  titlestyle: {
    alignSelf: "center",
    marginTop: 12,
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

export default TermsnConditionScreen;
