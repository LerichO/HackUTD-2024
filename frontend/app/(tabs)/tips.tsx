import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';

// Define the structure of a Tip
interface Tip {
  id: number;
  title: string;
  description: string;
}

// Extended sample budgeting tips
const tips: Tip[] = [
  {
    id: 1,
    title: 'Set Clear Financial Goals',
    description: 'It\'s important to define short-term and long-term financial goals. This helps you stay focused and track your progress.'
  },
  {
    id: 2,
    title: 'Track Your Spending',
    description: 'Use an app or spreadsheet to track every dollar spent. This will help you identify areas to save and manage your budget effectively.'
  },
  {
    id: 3,
    title: 'Cut Unnecessary Expenses',
    description: 'Review your subscriptions and daily expenses to find areas where you can cut back. Every little bit helps!'
  },
  {
    id: 4,
    title: 'Build an Emergency Fund',
    description: 'Having a savings cushion for emergencies can help you avoid going into debt when unexpected expenses arise.'
  },
  {
    id: 5,
    title: 'Plan for Big Purchases',
    description: 'Avoid impulse purchases by planning for major expenses in advance. Set aside money each month towards these purchases.'
  },
  {
    id: 6,
    title: 'Automate Your Savings',
    description: 'Set up automatic transfers to your savings account. This ensures that you’re consistently saving and makes it easier to stick to your budget.'
  },
  {
    id: 7,
    title: 'Review Your Credit Report',
    description: 'Check your credit report annually to ensure there are no errors and that your credit score remains healthy for future financial goals.'
  },
  {
    id: 8,
    title: 'Use Cash Envelopes for Discretionary Spending',
    description: 'Set aside a specific amount of cash for discretionary spending, such as eating out or entertainment, and stick to it.'
  },
  {
    id: 9,
    title: 'Find a Budgeting Method that Works for You',
    description: 'Try different methods like the 50/30/20 rule, zero-based budgeting, or the envelope system to see which one best fits your lifestyle.'
  },
  {
    id: 10,
    title: 'Cut Back on Luxuries',
    description: 'Examine your luxury spending habits, like expensive coffee or monthly subscriptions, and try to reduce them to save money.'
  },
  {
    id: 11,
    title: 'Use Coupons and Discounts',
    description: 'Before making purchases, always look for coupons or discount codes. Over time, this can add up to significant savings.'
  },
  {
    id: 12,
    title: 'Prioritize Debt Repayment',
    description: 'Focus on paying off high-interest debts first to reduce the overall interest paid, then move on to other debts in order of priority.'
  },
  {
    id: 13,
    title: 'Avoid Lifestyle Inflation',
    description: 'When you receive a pay raise or bonus, avoid increasing your spending proportionally. Instead, save or invest the extra income.'
  },
  {
    id: 14,
    title: 'Save for Retirement Early',
    description: 'Start saving for retirement as early as possible. Even small contributions can grow significantly over time with compound interest.'
  },
  {
    id: 15,
    title: 'Shop Smart and Compare Prices',
    description: 'Before making a purchase, compare prices from different stores or online marketplaces to ensure you’re getting the best deal.'
  },
  {
    id: 16,
    title: 'Set a Realistic Budget',
    description: 'Ensure that your budget is achievable by setting realistic limits for each category based on your actual income and expenses.'
  },
  {
    id: 17,
    title: 'Limit High-Cost Debt',
    description: 'Avoid taking on high-interest debt like payday loans or credit card debt. Stick to using credit responsibly and pay off balances quickly.'
  },
  {
    id: 18,
    title: 'Track Your Net Worth',
    description: 'Regularly calculate your net worth (assets minus liabilities) to assess your financial progress and set future goals.'
  },
  {
    id: 19,
    title: 'Plan for Taxes',
    description: 'Set aside money throughout the year for taxes, especially if you’re self-employed or earn income outside of a regular paycheck.'
  },
  {
    id: 20,
    title: 'Start an Investment Plan',
    description: 'Invest your savings in assets like stocks or real estate to grow your wealth over time. Research different investment vehicles that match your risk tolerance.'
  },
  {
    id: 21,
    title: 'Buy Used Instead of New',
    description: 'Consider purchasing used or refurbished items, such as furniture, electronics, or cars, to save money while still getting quality products.'
  },
  {
    id: 22,
    title: 'Be Mindful of Emotional Spending',
    description: 'Avoid impulse buying based on emotions, like stress or boredom. Take a moment to assess whether the purchase aligns with your budget.'
  },
  {
    id: 23,
    title: 'Set Aside Money for Fun',
    description: 'While budgeting is about managing expenses, it’s also important to set aside some money for fun and leisure activities so that budgeting feels less restrictive.'
  },
  {
    id: 24,
    title: 'Evaluate Your Subscriptions Periodically',
    description: 'Review all your subscriptions (e.g., Netflix, gym memberships) regularly to determine if you still use them or if you can cancel any of them.'
  },
  {
    id: 25,
    title: 'Avoid Going into Debt for Non-Essentials',
    description: 'Don’t take on debt for things like vacations or non-essential purchases. Save up for these items instead.'
  },
  {
    id: 26,
    title: 'Use a Financial App to Stay on Track',
    description: 'Download a budgeting app to help you monitor your expenses, set goals, and track your progress toward financial stability.'
  },
  {
    id: 27,
    title: 'Create an Annual Budget Review',
    description: 'At the end of each year, review your budget and financial goals to assess progress, adjust for changes, and plan for the coming year.'
  }
];

const TipsPage: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.header}>Budgeting Tips</Text>
        {tips.map((tip) => (
          <View key={tip.id} style={styles.tipCard}>
            <Text style={styles.tipTitle}>{tip.title}</Text>
            <Text style={styles.tipDescription}>{tip.description}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#8AC8D0',
  },
  scrollContainer: {
    padding: 16,
  },
  header: {
    fontSize: 35,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 26,
    textAlign: 'center',
    color: '#fff',
  },
  tipCard: {
    backgroundColor: '#fff',
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  tipTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#444',
  },
  tipDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});

export default TipsPage;
