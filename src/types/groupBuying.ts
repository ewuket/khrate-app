
export interface GroupSession {
  id: string;
  name: string;
  join_code: string;
  leader_id: string;
  min_participants: number;
  max_participants: number;
  discount_percentage: number;
  status: string;
  order_status: string;
  created_at: string;
  member_count?: number;
}

export interface GroupMember {
  id: string;
  user_id: string;
  group_session_id: string;
  joined_at: string;
  user_profile?: {
    full_name?: string;
    email: string;
  };
}

export interface GroupCartItem {
  id: string;
  user_id: string;
  product_id: number;
  product_name: string;
  product_price: number;
  quantity: number;
  product_unit: string;
  product_type: string;
  product_items?: string[];
}

export interface GroupPayment {
  id: string;
  user_id: string;
  amount: number;
  payment_status: string;
  payment_method?: string;
  created_at: string;
}

export interface GroupSummary {
  member_count: number;
  total_amount: number;
  discount_amount: number;
  final_amount: number;
  qualifies_for_discount: boolean;
}

export interface GroupPaymentSummary {
  total_members: number;
  paid_members: number;
  pending_members: number;
  total_amount_paid: number;
  group_ready: boolean;
}

export interface GroupBuyingContextType {
  currentGroup: GroupSession | null;
  groupCart: GroupCartItem[];
  groupCartItems: GroupCartItem[]; // Keep both for backward compatibility
  groupMembers: GroupMember[];
  groupPayments: GroupPayment[];
  groupSummary: GroupSummary | null;
  groupPaymentSummary: GroupPaymentSummary | null;
  availableGroups: GroupSession[];
  loading: boolean;
  createGroup: (name?: string, minParticipants?: number) => Promise<string | null>;
  joinGroup: (joinCode: string) => Promise<boolean>;
  leaveGroup: () => Promise<void>;
  addItemToGroupCart: (item: any) => Promise<void>;
  removeItemFromGroupCart: (id: string) => Promise<void>;
  updateGroupCartItemQuantity: (id: string, quantity: number) => Promise<void>;
  clearGroupCart: () => Promise<void>;
  getGroupTotal: () => number;
  loadAvailableGroups: () => Promise<void>;
  completeGroupPayment: () => Promise<boolean>;
  completeGroupOrder: () => Promise<boolean>;
}
