import { ComingSoonNotice } from '@/components/ComingSoonNotice';

export default function HumidorScreen() {
  return (
    <ComingSoonNotice
      icon="thermometer"
      title="Humidor conditions coming soon"
      message="Live temperature, humidity, and new-arrival notices from the shop's humidor will show up here."
    />
  );
}
