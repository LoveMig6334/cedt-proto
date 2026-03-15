"use client";

import SetupHeader from "@/components/setup/SetupHeader";
import { getFactory, saveAccounts, setSession, type Employee } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const departments = [
  { value: "management", label: "ผู้จัดการ / บริหาร" },
  { value: "sourcing", label: "จัดหาวัตถุดิบ" },
  { value: "intake", label: "รับเข้าวัตถุดิบ" },
  { value: "production", label: "ควบคุมการผลิต" },
  { value: "qc", label: "ตรวจสอบคุณภาพ" },
  { value: "warehouse", label: "คลังสินค้า" },
  { value: "sales", label: "ขาย & จัดส่ง" },
];

const inputClass =
  "w-full bg-white border-2 border-n-200 rounded-[9px] px-3.5 py-2.25 text-[13px] font-medium text-n-800 outline-none focus:border-p-400 focus:shadow-[0_0_0_3px_rgba(244,114,182,.08)] transition-colors placeholder:text-n-300";

const selectClass =
  "w-full bg-white border-2 border-n-200 rounded-[9px] px-3.5 py-2.25 text-[13px] font-medium text-n-800 outline-none focus:border-p-400 transition-colors cursor-pointer";

type NewEmployee = {
  name: string;
  email: string;
  password: string;
  title: string;
  department: string;
};

const emptyEmployee: NewEmployee = {
  name: "",
  email: "",
  password: "",
  title: "",
  department: "",
};

export default function EmployeesSetupPage() {
  const router = useRouter();
  const [factoryName, setFactoryName] = useState("");

  // Factory Manager (creator) fields
  const [manager, setManager] = useState<NewEmployee>({
    ...emptyEmployee,
    title: "ผู้จัดการโรงงาน",
    department: "management",
  });

  // Additional employees
  const [employees, setEmployees] = useState<NewEmployee[]>([]);
  const [newEmp, setNewEmp] = useState<NewEmployee>({ ...emptyEmployee });
  const [addError, setAddError] = useState("");
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    const factory = getFactory();
    if (!factory) {
      router.replace("/setup/factory");
      return;
    }
    setFactoryName(factory.name);
  }, [router]);

  function handleAddEmployee() {
    setAddError("");
    if (!newEmp.name.trim() || !newEmp.email.trim() || !newEmp.password.trim() || !newEmp.title.trim() || !newEmp.department) {
      setAddError("กรุณากรอกข้อมูลให้ครบทุกช่อง");
      return;
    }
    // Check duplicate email
    const allEmails = [
      manager.email.toLowerCase(),
      ...employees.map((e) => e.email.toLowerCase()),
    ];
    if (allEmails.includes(newEmp.email.toLowerCase())) {
      setAddError("อีเมลนี้ถูกใช้งานแล้ว");
      return;
    }
    setEmployees((prev) => [...prev, { ...newEmp }]);
    setNewEmp({ ...emptyEmployee });
  }

  function handleRemoveEmployee(index: number) {
    setEmployees((prev) => prev.filter((_, i) => i !== index));
  }

  function handleFinish() {
    setSubmitError("");
    if (!manager.name.trim() || !manager.email.trim() || !manager.password.trim()) {
      setSubmitError("กรุณากรอกข้อมูลผู้จัดการโรงงานให้ครบถ้วน");
      return;
    }

    const managerId = crypto.randomUUID();
    const allAccounts: Employee[] = [
      {
        id: managerId,
        name: manager.name.trim(),
        email: manager.email.trim(),
        password: manager.password,
        title: "ผู้จัดการโรงงาน",
        department: "management",
        role: "factory_manager",
        isPermanent: true,
      },
      ...employees.map((emp) => ({
        id: crypto.randomUUID(),
        name: emp.name.trim(),
        email: emp.email.trim(),
        password: emp.password,
        title: emp.title.trim(),
        department: emp.department,
        role: "employee" as const,
      })),
    ];

    saveAccounts(allAccounts);
    setSession({ userId: managerId, factoryId: "factory-1" });
    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <SetupHeader currentStep={2} />

      <main className="flex-1 max-w-[860px] mx-auto px-8 py-10 w-full">
        <div className="mb-8">
          <h1 className="text-[26px] font-extrabold text-n-900 mb-1.5">
            ข้อมูลพนักงาน
          </h1>
          <p className="text-[13.5px] text-n-500">
            {factoryName
              ? `ตั้งค่าบัญชีผู้ใช้สำหรับ "${factoryName}"`
              : "ตั้งค่าบัญชีผู้ใช้งานในโรงงาน"}
          </p>
        </div>

        {/* Factory Manager Section */}
        <div className="bg-white rounded-rlg border-2 border-p-300 shadow-[0_1px_3px_rgba(0,0,0,.04)] overflow-hidden mb-5">
          <div className="px-6 py-4 border-b border-p-100 bg-p-50 flex items-center justify-between">
            <div>
              <h2 className="text-[15px] font-bold text-n-900 flex items-center gap-2">
                ผู้จัดการโรงงาน
                <span className="bg-p-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  ถาวร
                </span>
              </h2>
              <p className="text-[12px] text-n-500 mt-0.5">
                ผู้สร้างโรงงานจะได้รับตำแหน่งนี้โดยอัตโนมัติ — ไม่สามารถลบได้
              </p>
            </div>
          </div>
          <div className="p-6 grid grid-cols-3 gap-4">
            <div>
              <label className="block text-[12px] font-bold text-n-700 mb-1.5">
                Username <span className="text-fp-red">*</span>
              </label>
              <input
                type="text"
                value={manager.name}
                onChange={(e) =>
                  setManager((m) => ({ ...m, name: e.target.value }))
                }
                placeholder="สมชาย มีดี"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-[12px] font-bold text-n-700 mb-1.5">
                อีเมล <span className="text-fp-red">*</span>
              </label>
              <input
                type="email"
                value={manager.email}
                onChange={(e) =>
                  setManager((m) => ({ ...m, email: e.target.value }))
                }
                placeholder="manager@factory.th"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-[12px] font-bold text-n-700 mb-1.5">
                รหัสผ่าน <span className="text-fp-red">*</span>
              </label>
              <input
                type="password"
                value={manager.password}
                onChange={(e) =>
                  setManager((m) => ({ ...m, password: e.target.value }))
                }
                placeholder="••••••••"
                className={inputClass}
              />
            </div>
            <div className="col-span-3">
              <label className="block text-[12px] font-bold text-n-700 mb-1.5">
                ตำแหน่ง
              </label>
              <input
                type="text"
                value="ผู้จัดการโรงงาน"
                readOnly
                className="w-full bg-n-50 border-2 border-n-200 rounded-[9px] px-3.5 py-2.25 text-[13px] font-semibold text-p-500 outline-none cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Add Employees Section */}
        <div className="bg-white rounded-rlg border border-p-100 shadow-[0_1px_3px_rgba(0,0,0,.04)] overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-n-100">
            <h2 className="text-[15px] font-bold text-n-900">เพิ่มพนักงาน</h2>
            <p className="text-[12px] text-n-500 mt-0.5">
              เพิ่มพนักงานที่รับผิดชอบแต่ละส่วน (ไม่บังคับ)
            </p>
          </div>

          {/* Add form */}
          <div className="p-6 border-b border-n-100">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-[11.5px] font-bold text-n-700 mb-1.5">
                  Username
                </label>
                <input
                  type="text"
                  value={newEmp.name}
                  onChange={(e) =>
                    setNewEmp((n) => ({ ...n, name: e.target.value }))
                  }
                  placeholder="เช่น somchai_m"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-[11.5px] font-bold text-n-700 mb-1.5">
                  อีเมล
                </label>
                <input
                  type="email"
                  value={newEmp.email}
                  onChange={(e) =>
                    setNewEmp((n) => ({ ...n, email: e.target.value }))
                  }
                  placeholder="email@factory.th"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-[11.5px] font-bold text-n-700 mb-1.5">
                  รหัสผ่าน
                </label>
                <input
                  type="password"
                  value={newEmp.password}
                  onChange={(e) =>
                    setNewEmp((n) => ({ ...n, password: e.target.value }))
                  }
                  placeholder="••••••••"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-[11.5px] font-bold text-n-700 mb-1.5">
                  ตำแหน่ง
                </label>
                <input
                  type="text"
                  value={newEmp.title}
                  onChange={(e) =>
                    setNewEmp((n) => ({ ...n, title: e.target.value }))
                  }
                  placeholder="เช่น หัวหน้าส่วนผลิต"
                  className={inputClass}
                />
              </div>
            </div>
            {addError && (
              <p className="text-fp-red text-[12px] mb-3">{addError}</p>
            )}
            <button
              onClick={handleAddEmployee}
              className="bg-p-50 border border-p-300 text-p-600 rounded-[9px] px-5 py-2 text-[13px] font-semibold hover:bg-p-100 transition-colors"
            >
              + เพิ่มพนักงาน
            </button>
          </div>

          {/* Employee list */}
          {employees.length > 0 ? (
            <div>
              <div className="px-6 py-3 bg-n-50 border-b border-n-100 grid grid-cols-[1fr_1fr_1fr_40px] gap-3 text-[11px] font-bold text-n-500 uppercase tracking-wide">
                <span>Username</span>
                <span>อีเมล</span>
                <span>ตำแหน่ง</span>
                <span />
              </div>
              {employees.map((emp, i) => (
                <div
                  key={i}
                  className="px-6 py-3.5 border-b border-n-100 last:border-0 grid grid-cols-[1fr_1fr_1fr_40px] gap-3 items-center hover:bg-n-50 transition-colors"
                >
                  <span className="text-[13px] font-semibold text-n-800 truncate">
                    {emp.name}
                  </span>
                  <span className="text-[12.5px] text-n-600 truncate">
                    {emp.email}
                  </span>
                  <span className="text-[12.5px] text-n-600 truncate">
                    {emp.title}
                  </span>
                  <button
                    onClick={() => handleRemoveEmployee(i)}
                    className="text-n-400 hover:text-fp-red text-[12px] transition-colors text-right"
                  >
                    ลบ
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-6 py-8 text-center text-[13px] text-n-400">
              ยังไม่มีพนักงานที่เพิ่ม — คุณสามารถเพิ่มภายหลังได้ใน Settings
            </div>
          )}
        </div>

        {/* Footer */}
        {submitError && (
          <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-[9px] text-fp-red text-[13px] font-medium">
            {submitError}
          </div>
        )}
        <div className="flex justify-between items-center">
          <a
            href="/setup/factory"
            className="text-[13px] text-n-500 hover:text-n-700 transition-colors"
          >
            ← แก้ไขข้อมูลโรงงาน
          </a>
          <button
            onClick={handleFinish}
            className="bg-linear-to-br from-p-400 to-p-500 text-white rounded-r px-10 py-3 text-[14.5px] font-bold shadow-[0_4px_20px_rgba(244,114,182,.3)] hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(244,114,182,.4)] transition-all"
          >
            ลงทะเบียนเสร็จสิ้น →
          </button>
        </div>
      </main>
    </div>
  );
}
