export type NotificationItem = {
  id: string;
  title: string;
  time: string;
  group: 'Today' | 'Yesterday' | 'This Week' | 'Earlier';
  productId?: string;
  read: boolean;
};

export const NOTIFICATIONS: NotificationItem[] = [
  { id: 'n1', title: 'Price drop: Bananas', time: '10 min ago', group: 'Today', productId: 'bananas', read: false },
  { id: 'n2', title: 'Restock: Milk', time: '1 hr ago', group: 'Today', read: false },
  { id: 'n3', title: 'Order shipped', time: '3 hrs ago', group: 'Today', read: false },
  { id: 'n4', title: 'Order delivered', time: 'Yesterday', group: 'Yesterday', read: true },
  { id: 'n5', title: 'Weekly savings summary ready', time: 'Yesterday', group: 'Yesterday', read: true },
  {
    id: 'n6',
    title: 'Order confirmed: Bread & Eggs',
    time: 'Mon, 9:20 AM',
    group: 'This Week',
    read: true,
  },
  { id: 'n7', title: 'Price drop: Yogurt', time: 'Sun, 4:15 PM', group: 'This Week', productId: 'yogurt', read: true },
  { id: 'n8', title: 'Welcome to CalmCart!', time: '2 weeks ago', group: 'Earlier', read: true },
  { id: 'n9', title: 'Profile setup complete', time: '2 weeks ago', group: 'Earlier', read: true },
];
