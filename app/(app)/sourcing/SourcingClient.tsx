"use client";

import { AnimatedButton } from "@/components/motion/AnimatedButton";
import { AnimatedCard } from "@/components/motion/AnimatedCard";
import { useState, useEffect } from "react";

export type Supplier = {
  name: string;
  sub: string;
  location: string;
  meatTypes: string[];
  rating: number;
  price: string;
  tags: string[];
  badge: string;
  badgeCls: string;
  score: number;
};

export type SourcingOrder = {
  id: string;
  supplier: Supplier;
  items: Record<string, { checked: boolean; quantity: string }>;
  deliveryDate: string;
  notes: string;
  status: "PO Sent" | "Invoice Ready" | "In Intake";
  timestamp: string;
};

const genericSuppliers: Supplier[] = [
  {
    name: "วิถีเนื้อไทย กาญจนบุรี",
    sub: "เครือข่ายสหกรณ์ จ.กาญจนบุรี",
    location: "อ.เมือง จ.กาญจนบุรี",
    meatTypes: ["เนื้อโคขุน", "สะโพก", "สามชั้น"],
    rating: 4.3,
    price: "฿168/กก.",
    tags: ["เนื้อโคขุน", "ส่งประจำ"],
    badge: "ราคาคุ้มค่า",
    badgeCls: "bg-[#F3F4F6] text-[#4B5563] border-[#D1D5DB]",
    score: 82,
  },
  {
    name: "พรีเมียมบีฟ ซัพพลาย",
    sub: "ผู้นำเข้าและฟาร์ม จ.สระบุรี",
    location: "อ.หนองแค จ.สระบุรี",
    meatTypes: ["Wagyu A4", "Wagyu A5", "ริบอาย"],
    rating: 4.9,
    price: "฿190/กก.",
    tags: ["Wagyu", "เกรด A4ขึ้นไป"],
    badge: "พรีเมียม",
    badgeCls: "bg-[#FEF9C3] text-[#CA8A04] border-[#FEF08A]",
    score: 98,
  },
  {
    name: "สยาม วากิว",
    sub: "ผู้ผลิตชั้นนำ จ.ขอนแก่น",
    location: "อ.ชุมแพ จ.ขอนแก่น",
    meatTypes: ["Wagyu 100%", "สเต๊กคัท", "เนื้อบด"],
    rating: 4.8,
    price: "฿185/กก.",
    tags: ["Wagyu 100%", "มีใบรับรอง"],
    badge: "คุณภาพสูง",
    badgeCls: "bg-[#FEF3C7] text-[#D97706] border-[#FDE68A]",
    score: 94,
  },
  {
    name: "ฟาร์มลุงบุญ",
    sub: "ฟาร์มโคเนื้อ จ.สุพรรณบุรี",
    location: "อ.สองพี่น้อง จ.สุพรรณบุรี",
    meatTypes: ["Wagyu crossbreed", "สันคอ", "เสือร้องไห้"],
    rating: 4.6,
    price: "฿180/กก.",
    tags: ["Wagyu crossbreed", "ปริมาณคงที่"],
    badge: "มั่นคง",
    badgeCls: "bg-[#F3F4F6] text-[#4B5563] border-[#D1D5DB]",
    score: 92,
  },
  {
    name: "บริษัท สมศรี ฟาร์ม จำกัด",
    sub: "ฟาร์มโคเนื้อ จ.นครราชสีมา",
    location: "อ.ปากช่อง จ.นครราชสีมา",
    meatTypes: ["Wagyu (ออร์แกนิค)", "สันนอก", "เนื้อตุ๋น"],
    rating: 4.8,
    price: "฿185/กก.",
    tags: ["Wagyu", "ออร์แกนิค"],
    badge: "มาตรฐานออร์แกนิค",
    badgeCls: "bg-[#ECFCCB] text-[#65A30D] border-[#D9F99D]",
    score: 96,
  },
  {
    name: "วีระ ฟาร์ม",
    sub: "ฟาร์มมาตรฐาน จ.นครปฐม",
    location: "อ.กำแพงแสน จ.นครปฐม",
    meatTypes: ["Wagyu พื้นเมือง", "เนื้อน่อง", "เศษเนื้อ"],
    rating: 4.5,
    price: "฿170/กก.",
    tags: ["Wagyu พื้นเมือง", "ราคาคุ้มค่า"],
    badge: "ราคาดี",
    badgeCls: "bg-[#D1FAE5] text-[#059669] border-[#A7F3D0]",
    score: 89,
  },
  {
    name: "โคกู้ชาติ ออร์แกนิค",
    sub: "ฟาร์มโคเนื้อ จ.บุรีรัมย์",
    location: "อ.นางรอง จ.บุรีรัมย์",
    meatTypes: ["Wagyu ออร์แกนิค", "สันใน", "ทีโบน"],
    rating: 4.7,
    price: "฿175/กก.",
    tags: ["Wagyu", "เลี้ยงปล่อยธรรมชาติ"],
    badge: "ฟาร์มเปิด",
    badgeCls: "bg-[#ECFCCB] text-[#65A30D] border-[#D9F99D]",
    score: 95,
  },
  {
    name: "ทิพย์ มารีน แอนด์ มีท",
    sub: "ศูนย์กระจายสินค้า กทม.",
    location: "เขตคลองเตย กรุงเทพมหานคร",
    meatTypes: ["Wagyu พรีเมียม", "Dry Aged", "ตัดแต่งพิเศษ"],
    rating: 4.7,
    price: "฿188/กก.",
    tags: ["Wagyu พรีเมียม", "จัดส่ง 24 ชม."],
    badge: "พร้อมส่ง",
    badgeCls: "bg-[#E0F2FE] text-[#0284C7] border-[#BAE6FD]",
    score: 93,
  },
  {
    name: "บ้านไร่ แกรนด์มีท",
    sub: "ฟาร์ม จ.ราชบุรี",
    location: "อ.โพธาราม จ.ราชบุรี",
    meatTypes: ["Wagyu ญี่ปุ่น", "เนื้อสไลด์ชาบู", "ปิ้งย่าง"],
    rating: 4.6,
    price: "฿178/กก.",
    tags: ["Wagyu ญี่ปุ่น", "สดใหม่"],
    badge: "สดใหม่",
    badgeCls: "bg-[#ECFCCB] text-[#65A30D] border-[#D9F99D]",
    score: 91,
  },
  {
    name: "โชคดี แฟมิลี่ ฟาร์ม",
    sub: "ฟาร์มครอบครัว จ.ลพบุรี",
    location: "อ.พัฒนานิคม จ.ลพบุรี",
    meatTypes: ["Wagyu ทางเลือก", "เครื่องใน", "เนื้อรวม"],
    rating: 4.5,
    price: "฿172/กก.",
    tags: ["Wagyu ทางเลือก", "ดูแลอย่างดี"],
    badge: "ยอดนิยม",
    badgeCls: "bg-[#FFEDD5] text-[#EA580C] border-[#FED7AA]",
    score: 88,
  },
];

const initialChatMessages = [
  {
    role: "ai" as const,
    text: "สวัสดีครับ! ฉันช่วยวิเคราะห์และแนะนำผู้จัดส่งที่เหมาะสมได้ มีความต้องการพิเศษอะไรไหมครับ?",
  },
  {
    role: "user" as const,
    text: "ต้องการเนื้อวัว Wagyu คุณภาพสูง ประมาณ 50 กก./สัปดาห์",
  },
  {
    role: "ai" as const,
    text: 'จากข้อมูล ฉันแนะนำ "สมศรี ฟาร์ม" — คะแนน 96/100 มีสต็อก Wagyu พร้อมส่ง ราคาแข่งขันได้ และผ่าน QC เฉลี่ย 97.2% ครับ',
  },
];

type ChatMessage = {
  role: "ai" | "user";
  text: string;
};

export function SourcingClient() {
  const [suppliers, setSuppliers] = useState<Supplier[]>(genericSuppliers);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [isCreatingPO, setIsCreatingPO] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(initialChatMessages);
  const [inputValue, setInputValue] = useState("");
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [subSearchQuery, setSubSearchQuery] = useState("");
  
  // History and Navigation
  const [activeTab, setActiveTab] = useState<"find" | "history">("find");
  const [orders, setOrders] = useState<SourcingOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<SourcingOrder | null>(null);

  // Load orders from localStorage on mount
  useEffect(() => {
    const savedOrders = localStorage.getItem("sourcing_orders");
    if (savedOrders) {
      try {
        setOrders(JSON.parse(savedOrders));
      } catch (e) {
        console.error("Failed to load orders from localStorage", e);
      }
    }
  }, []);

  // Save orders to localStorage whenever they change
  useEffect(() => {
    if (orders.length > 0) {
      localStorage.setItem("sourcing_orders", JSON.stringify(orders));
    }
  }, [orders]);
  
  // PO Form states
  const [deliveryDate, setDeliveryDate] = useState("");
  const [orderItems, setOrderItems] = useState<Record<string, { checked: boolean, quantity: string }>>({});
  const [notes, setNotes] = useState("");

  const handleClosePanel = () => {
    setSelectedSupplier(null);
    setIsCreatingPO(false);
    setIsSubmitted(false);
    setSelectedOrder(null);
    setDeliveryDate("");
    setOrderItems({});
    setNotes("");
  };

  const isFormValid = () => {
    if (!deliveryDate) return false;
    
    // Check if date is in the past
    const selectedDate = new Date(deliveryDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) return false;

    const hasSelectedItems = Object.values(orderItems).some(item => item.checked && parseFloat(item.quantity) > 0);
    const hasOverLimitItems = Object.values(orderItems).some(item => item.checked && parseFloat(item.quantity) > 1000);
    
    return hasSelectedItems && !hasOverLimitItems;
  };

  const handleItemToggle = (meat: string) => {
    setOrderItems(prev => ({
      ...prev,
      [meat]: {
        ...prev[meat],
        checked: !prev[meat]?.checked
      }
    }));
  };

  const handleQuantityChange = (meat: string, qty: string) => {
    setOrderItems(prev => ({
      ...prev,
      [meat]: {
        ...prev[meat],
        quantity: qty
      }
    }));
  };

  const handleSubmitPO = () => {
    if (!selectedSupplier || !isFormValid()) return;
    
    const newOrder: SourcingOrder = {
      id: `PO-${Math.floor(Math.random() * 90000) + 10000}`,
      supplier: selectedSupplier,
      items: { ...orderItems },
      deliveryDate,
      notes,
      status: "Invoice Ready", // Mocking status to ready for demo
      timestamp: new Date().toLocaleString(),
    };

    setOrders(prev => [newOrder, ...prev]);
    setIsSubmitted(true);
  };

  const handleMoveToIntake = (orderId: string) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: "In Intake" } : order
    ));
    if (selectedOrder?.id === orderId) {
      setSelectedOrder(prev => prev ? { ...prev, status: "In Intake" } : null);
    }
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const newUserMessage: ChatMessage = { role: "user", text: inputValue };
    setChatMessages((prev) => [...prev, newUserMessage]);
    setInputValue("");
    setIsAiTyping(true);

    // Simulate AI thinking and response
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        role: "ai",
        text: "นี่คือ 3 รายชื่อผู้จัดส่งเนื้อวัว Wagyu ที่เหมาะสมที่สุดตามความต้องการของคุณครับ ฉันได้คัดเลือกจากทั้งคุณภาพ ราคา และความน่าเชื่อถือ:",
      };
      setChatMessages((prev) => [...prev, aiResponse]);
      
      // Select 3 to be recommended, and sort them to the top.
      const recommendedNames = ["พรีเมียมบีฟ ซัพพลาย", "โคกู้ชาติ ออร์แกนิค", "ฟาร์มลุงบุญ"];
      
      const newSuppliersList = genericSuppliers.map(sup => {
        if (recommendedNames.includes(sup.name)) {
          return {
            ...sup,
            badge: "AI recommended",
            badgeCls: "bg-p-100 text-p-500 border-p-200"
          };
        }
        return sup;
      }).sort((a, b) => {
         const aIsRec = a.badge === "AI recommended";
         const bIsRec = b.badge === "AI recommended";
         if (aIsRec && !bIsRec) return -1;
         if (!aIsRec && bIsRec) return 1;
         return b.score - a.score; // Fallback sort by score for the rest
      });

      setSuppliers(newSuppliersList);
      setIsAiTyping(false);
    }, 1500); // 1.5s delay
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div>
      <div className="flex justify-between items-start mb-5.5">
        <div>
          <div className="text-[20px] font-extrabold text-n-900 mb-0.75">
            🔍 จัดหาวัตถุดิบ (Sourcing)
          </div>
          <div className="text-[12.5px] text-n-500">
            ระบบจัดทำใบสั่งซื้อและตรวจสอบใบแจ้งหนี้อัตโนมัติ
          </div>
        </div>
        <div className="flex gap-2 p-1 bg-n-100 rounded-[12px]">
           <button 
             onClick={() => setActiveTab("find")}
             className={`px-4 py-2 rounded-[9px] text-[13px] font-bold transition-all ${activeTab === "find" ? "bg-white text-p-500 shadow-sm" : "text-n-500 hover:text-n-700"}`}
           >
             ค้นหาผู้ส่ง (Find Suppliers)
           </button>
           <button 
             onClick={() => setActiveTab("history")}
             className={`px-4 py-2 rounded-[9px] text-[13px] font-bold transition-all ${activeTab === "history" ? "bg-white text-p-500 shadow-sm" : "text-n-500 hover:text-n-700"}`}
           >
             ประวัติคำสั่งซื้อ (Order History)
             {orders.filter(o => o.status === "Invoice Ready").length > 0 && (
                <span className="ml-2 w-2 h-2 bg-p-500 rounded-full inline-block animate-pulse" />
             )}
           </button>
        </div>
      </div>

      {activeTab === "find" ? (
      <div className="grid grid-cols-[1fr_320px] gap-4.5">
        {/* Supplier cards */}
        <div>
          <div className="flex items-center gap-2 bg-white border-[1.5px] border-n-200 rounded-[9px] px-3 py-2 mb-4 focus-within:border-p-400 transition-all">
            <span className="text-n-400">🔍</span>
            <input
              placeholder="ค้นหาผู้จัดส่ง (ชื่อ หรือ สินค้า)..."
              value={subSearchQuery}
              onChange={(e) => setSubSearchQuery(e.target.value)}
              className="flex-1 border-none outline-none font-sans text-[13px] text-n-800 bg-transparent placeholder:text-n-300"
            />
          </div>
          <div className="space-y-3">
            {suppliers
              .filter(sup => 
                sup.name.toLowerCase().includes(subSearchQuery.toLowerCase()) || 
                sup.meatTypes.some(m => m.toLowerCase().includes(subSearchQuery.toLowerCase()))
              )
              .map((sup, i) => (
              <AnimatedCard
                key={sup.name}
                onClick={() => setSelectedSupplier(sup)}
                className={`bg-white border-[1.5px] rounded-[12px] p-3.75 cursor-pointer transition-all hover:border-p-400 ${selectedSupplier?.name === sup.name ? "border-p-500 bg-p-50 shadow-[0_0_0_2px_rgba(236,72,153,0.1)]" : "border-p-100"}`}
                hoverY={-2}
                hoverShadow="0 4px 20px rgba(244,114,182,0.25)"
              >
                <div className="flex justify-between items-start mb-2.75">
                  <div className="w-10 h-10 rounded-[10px] bg-n-100 flex items-center justify-center text-[17px]">
                    🐄
                  </div>
                  <div className="flex items-center gap-0.75 text-[11.5px] font-semibold text-fp-yellow">
                    ★ {sup.rating}
                  </div>
                </div>
                <div className="text-[13.5px] font-bold text-n-900 mb-0.5">
                  {sup.name}
                </div>
                <div className="text-[11.5px] text-n-500 mb-2">{sup.sub}</div>
                <div className="flex gap-1 flex-wrap mb-2.25">
                  {sup.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.25 py-0.5 bg-p-50 text-p-500 rounded-full text-[10px] font-semibold border border-p-200"
                    >
                      {tag}
                    </span>
                  ))}
                  <span
                    className={`px-2.25 py-0.5 rounded-full text-[10px] font-semibold border ${sup.badgeCls} ${sup.badge === "AI recommended" ? "bg-p-500 text-white border-p-500 py-1 px-3 shadow-md pulse-animation" : ""}`}
                    style={
                      sup.badge === "AI recommended"
                        ? {
                            background: "linear-gradient(135deg, #f472b6, #ec4899)",
                            animation: "pulseShadow 2s infinite"
                          }
                        : {}
                    }
                  >
                    ✨ {sup.badge}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2.25 border-t border-n-100">
                  <div className="text-[14.5px] font-extrabold text-n-900">
                    {sup.price}{" "}
                    <span className="text-[10.5px] text-n-400 font-normal">
                      ต่อ กก.
                    </span>
                  </div>
                  <div className="text-[11px] text-n-400">
                    AI Score: <b className="text-p-500">{sup.score}/100</b>
                  </div>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </div>

        {/* Right Panel: Detail View or AI Chat */}
        {selectedSupplier ? (
          <div className="bg-white rounded-[16px] border border-p-100 shadow-[0_4px_20px_rgba(244,114,182,0.08)] flex flex-col h-[600px] overflow-hidden">
            <div className="px-5 pt-4 pb-3.25 border-b border-n-100 bg-gradient-to-r from-white to-p-50 flex items-center justify-between">
               <div className="text-[14.5px] font-extrabold text-n-900 flex items-center gap-2">
                 {isCreatingPO ? "📝 สร้างใบสั่งซื้อ (Generate PO)" : "📋 รายละเอียดผู้จัดส่ง"}
               </div>
               <button onClick={handleClosePanel} className="text-[12px] font-semibold text-p-500 hover:text-p-600 cursor-pointer">
                 ปิด (Close)
               </button>
            </div>
            
            {isCreatingPO ? (
              isSubmitted ? (
                 <div className="flex-1 flex flex-col p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-p-200 scrollbar-track-transparent">
                    <div className="flex flex-col items-center text-center mb-6">
                      <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-[32px] mb-3 shadow-sm">
                        ✅
                      </div>
                      <div className="text-[18px] font-extrabold text-n-900 mb-1">ส่งใบสั่งซื้อสำเร็จ!</div>
                      <div className="text-[12px] text-n-500">ระบบได้ทำการส่งข้อมูลไปยังผู้จัดส่งแล้ว</div>
                    </div>

                    <div className="bg-n-50 border border-n-100 rounded-[12px] p-5 font-mono text-[12px] text-n-800 space-y-4 shadow-sm">
                      <div className="flex justify-between border-b border-n-200 pb-2 mb-2">
                        <span className="font-bold text-n-400">SUBJECT:</span>
                        <span className="font-bold text-p-600 truncate">PO #{Math.floor(Math.random() * 90000) + 10000} - FreshPro</span>
                      </div>
                      
                      <div>
                        <span className="block font-bold text-n-400 mb-1 uppercase tracking-wider text-[10px]">TO (ถึง):</span>
                        <div className="font-bold">{selectedSupplier.name}</div>
                        <div className="text-n-500 text-[11px]">{selectedSupplier.location}</div>
                      </div>

                      <div>
                        <span className="block font-bold text-n-400 mb-1 uppercase tracking-wider text-[10px]">DELIVERY DATE (วันส่งมอบ):</span>
                        <div className="font-bold text-n-900">{deliveryDate}</div>
                      </div>

                      <div>
                        <span className="block font-bold text-n-400 mb-1 uppercase tracking-wider text-[10px]">ORDER ITEMS (รายการ):</span>
                        <div className="space-y-1.5 mt-2 bg-white p-3 rounded-lg border border-n-100">
                          {Object.entries(orderItems)
                            .filter(([_, item]) => item.checked && parseFloat(item.quantity) > 0)
                            .map(([meat, item]) => (
                              <div key={meat} className="flex justify-between items-center text-[12.5px]">
                                <span className="text-n-700">• {meat}</span>
                                <span className="font-bold text-n-900">{item.quantity} กก.</span>
                              </div>
                            ))
                          }
                        </div>
                      </div>

                      {notes && (
                        <div>
                          <span className="block font-bold text-n-400 mb-1 uppercase tracking-wider text-[10px]">REMARKS (หมายเหตุ):</span>
                          <div className="bg-n-100/50 p-2.5 rounded italic text-n-600 leading-relaxed border-l-2 border-n-200">
                            "{notes}"
                          </div>
                        </div>
                      )}

                      <div className="pt-4 border-t border-n-200 text-center text-n-400 text-[10px]">
                        --- CONFIDENTIAL FRESHPRO SOURCING ---
                      </div>
                    </div>

                    <div className="mt-6 flex justify-center">
                      <button 
                        onClick={handleClosePanel} 
                        className="w-full bg-n-900 hover:bg-black text-white font-bold rounded-[10px] py-3 text-[13px] transition-all shadow-md active:scale-95"
                      >
                        ปิดหน้าต่าง (Close)
                      </button>
                    </div>
                 </div>
              ) : (
                <>
                  <div className="flex-1 p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-p-200 scrollbar-track-transparent">
                     <div className="mb-5">
                       <div className="text-[14px] font-extrabold text-n-900">{selectedSupplier.name}</div>
                       <div className="text-[12px] text-n-500">สร้างใบสั่งซื้อวัตถุดิบ</div>
                     </div>

                     <div className="space-y-4">
                       <div>
                         <label className="block text-[12px] font-bold text-n-700 mb-1.5">วันส่งมอบ (Expected Delivery Date) <span className="text-red-500">*</span></label>
                         <input 
                           type="date" 
                           value={deliveryDate}
                           min={new Date().toLocaleDateString('en-CA')}
                           onChange={(e) => setDeliveryDate(e.target.value)}
                           className="w-full px-4 py-2.5 border-[1.5px] border-n-200 rounded-[10px] text-[13px] outline-none focus:border-p-400 bg-white" 
                         />
                       </div>

                       <div>
                         <label className="block text-[12px] font-bold text-n-700 mb-1.5">รายการที่สั่ง (Order Items) <span className="text-red-500">*</span></label>
                         <div className="space-y-2 border-[1.5px] border-n-200 rounded-[10px] p-3 bg-white">
                           {selectedSupplier.meatTypes.map((meat, idx) => (
                             <label key={idx} className="flex items-center gap-3 p-2 hover:bg-n-50 rounded-md cursor-pointer transition-colors">
                               <input 
                                 type="checkbox" 
                                 checked={orderItems[meat]?.checked || false}
                                 onChange={() => handleItemToggle(meat)}
                                 className="w-4 h-4 rounded border-n-300 text-p-500 focus:ring-p-500" 
                               />
                               <span className="text-[13px] font-medium text-n-800 flex-1">{meat}</span>
                               <input 
                                 type="number" 
                                 placeholder="จำนวน (กก.)" 
                                 value={orderItems[meat]?.quantity || ""}
                                 max={1000}
                                 onChange={(e) => handleQuantityChange(meat, e.target.value)}
                                 className={`w-[100px] px-2 py-1 border-[1.5px] rounded-md text-[12px] outline-none focus:border-p-400 bg-white disabled:bg-n-100 ${parseFloat(orderItems[meat]?.quantity || "0") > 1000 ? "border-red-500 text-red-500" : "border-n-200"}`} 
                                 disabled={!orderItems[meat]?.checked}
                               />
                             </label>
                           ))}
                         </div>
                       </div>
                       
                       <div>
                         <label className="block text-[12px] font-bold text-n-700 mb-1.5">หมายเหตุ (Notes)</label>
                         <textarea 
                           rows={3} 
                           placeholder="ระบุความต้องการเพิ่มเติม..." 
                           value={notes}
                           onChange={(e) => setNotes(e.target.value)}
                           className="w-full px-4 py-2.5 border-[1.5px] border-n-200 rounded-[10px] text-[13px] outline-none focus:border-p-400 bg-white resize-none" 
                         />
                       </div>
                     </div>
                  </div>
                  <div className="p-4 border-t border-n-100 bg-white flex gap-3">
                     <button 
                       onClick={() => setIsCreatingPO(false)}
                       className="flex-1 bg-white border-[1.5px] border-n-200 text-n-700 rounded-[10px] py-3 text-[13px] font-bold hover:bg-n-50 transition-all"
                     >
                       ยกเลิก (Cancel)
                     </button>
                     <button 
                       onClick={handleSubmitPO}
                       disabled={!isFormValid()}
                       className="flex-1 bg-linear-to-br from-p-400 to-p-500 disabled:from-n-300 disabled:to-n-400 text-white rounded-[10px] py-3 text-[13px] font-bold shadow-[0_4px_15px_rgba(244,114,182,0.25)] hover:from-p-500 hover:to-p-600 transition-all cursor-pointer disabled:cursor-not-allowed"
                     >
                       ยืนยันการสั่งซื้อ (Submit PO)
                     </button>
                  </div>
                </>
              )
            ) : (
              <>
                <div className="flex-1 p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-p-200 scrollbar-track-transparent">
                   <div className="w-16 h-16 rounded-[14px] bg-n-100 flex items-center justify-center text-[28px] mb-4">
                     🐄
                   </div>
                   <div className="text-[20px] font-extrabold text-n-900 mb-1">
                     {selectedSupplier.name}
                   </div>
                   <div className="text-[13px] text-n-500 mb-5">{selectedSupplier.sub}</div>

                   <div className="space-y-4">
                     <div className="p-4 rounded-[12px] bg-n-50 border border-n-100 transition-all hover:border-n-200">
                       <div className="text-[11.5px] font-bold text-n-400 uppercase tracking-widest mb-2">สถานที่ตั้ง (Location)</div>
                       <div className="text-[13.5px] text-n-800 font-semibold flex items-center gap-2">
                         <span className="text-[16px]">📍</span> {selectedSupplier.location}
                       </div>
                     </div>

                     <div className="p-4 rounded-[12px] bg-n-50 border border-n-100 transition-all hover:border-n-200">
                       <div className="text-[11.5px] font-bold text-n-400 uppercase tracking-widest mb-3">ประเภทเนื้อที่จำหน่าย (Meat Types)</div>
                       <div className="flex flex-wrap gap-2">
                         {selectedSupplier.meatTypes.map((meat, idx) => (
                           <span key={idx} className="px-3 py-1.5 bg-white text-n-700 rounded-md text-[12px] font-bold border border-n-200 shadow-sm">
                             {meat}
                           </span>
                         ))}
                       </div>
                     </div>

                     <div className="p-4 rounded-[12px] bg-p-50 border border-p-100 flex justify-between items-center transition-all hover:border-p-200">
                       <div className="text-[11.5px] font-bold text-p-500 uppercase tracking-widest">ราคาเฉลี่ย (Price)</div>
                       <div className="text-[18px] font-extrabold text-p-600">
                         {selectedSupplier.price}
                       </div>
                     </div>
                   </div>
                </div>
                <div className="p-4 border-t border-n-100 bg-white">
                   <button 
                     onClick={() => setIsCreatingPO(true)}
                     className="w-full bg-linear-to-br from-p-400 to-p-500 text-white rounded-[10px] py-3.5 text-[14px] font-bold shadow-[0_4px_20px_rgba(244,114,182,0.25)] hover:from-p-500 hover:to-p-600 transition-all flex items-center justify-center gap-2 focus:ring-4 focus:ring-p-200 text-center"
                   >
                     <span>+</span> สร้างใบสั่งซื้อ (Generate PO)
                   </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-[16px] border border-p-100 shadow-[0_4px_20px_rgba(244,114,182,0.08)] flex flex-col h-[600px] overflow-hidden">
            <div className="px-5 pt-4 pb-3.25 border-b border-n-100 bg-gradient-to-r from-white to-p-50">
              <div className="text-[14.5px] font-extrabold text-n-900 flex items-center gap-2">
              <span className="text-[18px]">🤖</span> AI Sourcing Assistant
            </div>
            <div className="text-[11.5px] text-n-500 mt-1 font-medium">
              พิมพ์ข้อความเพื่อค้นหาผู้จัดส่งที่ตรงใจคุณ
            </div>
          </div>
          <div className="flex-1 p-4 flex flex-col gap-3 overflow-y-auto scrollbar-thin scrollbar-thumb-p-200 scrollbar-track-transparent">
            {chatMessages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-2 items-start ${msg.role === "user" ? "flex-row-reverse" : ""}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-[13px] shrink-0 shadow-sm ${msg.role === "ai" ? "bg-linear-to-br from-p-400 to-p-500 text-white" : "bg-n-800 text-white"}`}
                >
                  {msg.role === "ai" ? "🤖" : "ส"}
                </div>
                <div
                  className={`max-w-[80%] px-3.5 py-2.5 rounded-[12px] text-[13px] leading-relaxed shadow-sm ${msg.role === "ai" ? "bg-white border border-p-100 text-n-800 rounded-tl-none" : "bg-n-900 text-white rounded-tr-none"}`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isAiTyping && (
                <div className="flex gap-2 items-start">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-[13px] shrink-0 shadow-sm bg-linear-to-br from-p-400 to-p-500 text-white">
                        🤖
                    </div>
                    <div className="max-w-[80%] px-4 py-3 rounded-[12px] text-[13px] bg-white border border-p-100 rounded-tl-none shadow-sm flex items-center gap-1">
                        <div className="w-1.5 h-1.5 bg-p-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="w-1.5 h-1.5 bg-p-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="w-1.5 h-1.5 bg-p-400 rounded-full animate-bounce"></div>
                    </div>
                </div>
            )}
          </div>
          <div className="px-3 py-3 border-t border-n-100 bg-white flex gap-2 items-center">
            <input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="พิมพ์ความต้องการของคุณที่นี่..."
              className="flex-1 px-4 py-2.5 border-[1.5px] border-n-200 rounded-full font-sans text-[13px] outline-none bg-n-50 focus:border-p-400 focus:bg-white transition-all placeholder:text-n-400"
            />
            <button
              onClick={handleSendMessage}
              disabled={isAiTyping || !inputValue.trim()}
              className="w-10 h-10 bg-linear-to-br from-p-400 to-p-500 hover:from-p-500 hover:to-p-600 disabled:from-n-300 disabled:to-n-400 border-none rounded-full cursor-pointer text-white text-[16px] shrink-0 flex items-center justify-center shadow-md transition-all active:scale-95 flex items-center justify-center"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z" fill="currentColor"/>
              </svg>
            </button>
          </div>
        </div>
        )}
      </div>
      ) : (
        <div className="grid grid-cols-[1fr_360px] gap-4.5">
           {/* Order List */}
           <div className="space-y-3">
              <div className="text-[15px] font-bold text-n-900 mb-4 px-1 flex items-center gap-2">
                📋 ประวัติคำสั่งซื้อ (Order History)
              </div>
              
              {orders.length === 0 ? (
                <div className="bg-white border-[1.5px] border-n-100 rounded-[16px] p-10 text-center">
                   <div className="text-[40px] mb-3">📦</div>
                   <div className="text-n-900 font-bold mb-1">ยังไม่มีประวัติการสั่งซื้อ</div>
                   <div className="text-n-400 text-[13px]">เริ่มต้นค้นหาผู้ส่งและสร้างใบสั่งซื้อรายการแรกของคุณ</div>
                </div>
              ) : (
                orders.map((order) => (
                  <AnimatedCard
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    className={`bg-white border-[1.5px] rounded-[16px] p-4 cursor-pointer transition-all hover:border-p-400 ${selectedOrder?.id === order.id ? "border-p-500 bg-p-50 shadow-md" : "border-n-100"}`}
                    hoverY={-2}
                  >
                    <div className="flex justify-between items-center">
                       <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-[20px] ${order.status === 'In Intake' ? 'bg-green-50 text-green-600' : 'bg-p-50 text-p-600'}`}>
                             {order.status === 'In Intake' ? '🚚' : '📄'}
                          </div>
                          <div>
                             <div className="text-[14px] font-extrabold text-n-900">{order.id}</div>
                             <div className="text-[12px] text-n-500 font-medium">{order.supplier.name}</div>
                          </div>
                       </div>
                       <div className="text-right">
                          <div className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider mb-1.5 ${
                            order.status === 'PO Sent' ? 'bg-blue-50 text-blue-500 border border-blue-100' :
                            order.status === 'Invoice Ready' ? 'bg-amber-50 text-amber-600 border border-amber-100 animate-pulse' :
                            'bg-green-50 text-green-600 border border-green-100'
                          }`}>
                            {order.status}
                          </div>
                          <div className="text-[11px] text-n-400">{order.timestamp}</div>
                       </div>
                    </div>
                  </AnimatedCard>
                ))
              )}
           </div>

           {/* Detail / Invoice View */}
           <div className="bg-white rounded-[20px] border-[1.5px] border-n-100 shadow-xl overflow-hidden flex flex-col h-[600px]">
              {selectedOrder ? (
                 <div className="flex-1 flex flex-col h-full">
                    <div className="px-6 py-5 border-b border-n-100 bg-gradient-to-r from-n-50 to-white flex justify-between items-center">
                       <div>
                          <div className="text-[13px] font-extrabold text-n-900">สรุปรายละเอียดออเดอร์</div>
                          <div className="text-[11px] text-n-400 font-medium">Order ID: {selectedOrder.id}</div>
                       </div>
                       <div className="bg-white p-2 rounded-lg text-lg shadow-sm">🐄</div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-p-200">
                       <div className="mb-6">
                          <div className="text-[11px] font-bold text-n-400 uppercase mb-3 tracking-widest">ข้อมูลผู้จัดส่ง</div>
                          <div className="flex items-start gap-3 p-3 bg-n-50 rounded-xl border border-n-100">
                             <div className="text-xl">🏢</div>
                             <div>
                                <div className="text-[13px] font-bold text-n-900">{selectedOrder.supplier.name}</div>
                                <div className="text-[11px] text-n-500">{selectedOrder.supplier.location}</div>
                             </div>
                          </div>
                       </div>

                       <div className="mb-6">
                          <div className="text-[11px] font-bold text-n-400 uppercase mb-3 tracking-widest">รายการที่สั่ง</div>
                          <div className="space-y-2">
                             {Object.entries(selectedOrder.items)
                               .filter(([_, item]) => item.checked)
                               .map(([name, item]) => (
                                 <div key={name} className="flex justify-between items-center py-2 px-3 bg-white border border-n-100 rounded-lg shadow-sm">
                                    <span className="text-[12.5px] text-n-700 font-medium">{name}</span>
                                    <span className="font-bold text-n-900 text-[13px]">{item.quantity} กก.</span>
                                 </div>
                               ))
                             }
                          </div>
                       </div>

                       <div className="mb-6">
                          <div className="flex justify-between mb-3">
                             <div className="text-[11px] font-bold text-n-400 uppercase tracking-widest">ใบแจ้งหนี้ (Mock Invoice)</div>
                             <div className="text-[11px] font-bold text-p-500">READY TO DOWNLOAD</div>
                          </div>
                          <div className="bg-p-50/30 border-2 border-dashed border-p-200 rounded-2xl p-6 text-center group cursor-pointer hover:bg-p-50 transition-all">
                             <div className="text-3xl mb-2 grayscale group-hover:grayscale-0 transition-all">🧾</div>
                             <div className="text-[13px] font-bold text-p-600 mb-0.5 underline">View_Invoice_{selectedOrder.id}.pdf</div>
                             <div className="text-[11px] text-n-400 font-medium">คลิกเพื่อดูรายละเอียดใบแจ้งหนี้</div>
                          </div>
                       </div>
                    </div>

                    <div className="p-5 bg-white border-t border-n-100">
                       {selectedOrder.status === 'Invoice Ready' ? (
                          <button 
                            onClick={() => handleMoveToIntake(selectedOrder.id)}
                            className="w-full bg-linear-to-br from-p-500 to-p-600 text-white rounded-xl py-4 text-[14px] font-bold shadow-lg shadow-p-200 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                          >
                             <span>🚚</span> ส่งไปยังฝ่ายรับเข้า (Move to Intake)
                          </button>
                       ) : selectedOrder.status === 'In Intake' ? (
                          <div className="flex items-center justify-center gap-2 p-4 bg-green-50 rounded-xl text-green-600 font-bold text-[13px] border border-green-100">
                             <span>✅</span> ส่งไปฝ่ายรับเข้าแล้ว (Moved to Intake)
                          </div>
                       ) : (
                          <div className="text-center text-[11px] text-n-400 italic py-2">
                             กำลังเตรียมใบแจ้งหนี้จากผู้จัดส่ง...
                          </div>
                       )}
                    </div>
                 </div>
              ) : (
                 <div className="flex-1 flex flex-col items-center justify-center p-10 text-center opacity-40">
                    <div className="text-[50px] mb-4">📜</div>
                    <div className="text-n-900 font-bold mb-1">เลือกรายการสั่งซื้อ</div>
                    <div className="text-n-400 text-[12px]">เพื่อดูรายละเอียดและดำเนินการต่อ</div>
                 </div>
              )}
           </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes pulseShadow {
          0% {
            box-shadow: 0 0 0 0 rgba(236, 72, 153, 0.4);
          }
          70% {
            box-shadow: 0 0 0 6px rgba(236, 72, 153, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(236, 72, 153, 0);
          }
        }
      `}</style>
    </div>
  );
}
