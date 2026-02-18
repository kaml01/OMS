import { Redirect } from 'expo-router';

export default function ApproverIndex() {
  return <Redirect href="/(main)/approver/pending_approval" />;
}
