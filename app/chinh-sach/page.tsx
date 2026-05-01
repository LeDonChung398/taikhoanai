import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chính sách",
  description: "Chính sách bảo mật, bảo hành và cam kết dịch vụ của TaiKhoanAI."
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h2 className="mb-3 text-[17px] font-bold text-[#1c2e55]">{title}</h2>
      <div className="space-y-2 text-[14px] leading-7 text-[#3a4d72]">{children}</div>
    </div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="mr-2 inline-block rounded-md bg-[#eef3ff] px-2 py-0.5 text-[12px] font-semibold text-[#2f4b93]">
      {children}
    </span>
  );
}

export default function ChinhSachPage() {
  return (
    <main className="site-container py-8 pb-14">
      <div className="mx-auto max-w-[820px]">
        {/* Hero */}
        <div className="mb-6 rounded-2xl bg-gradient-to-r from-[#1f3f8a] to-[#2b5ac8] px-5 py-6 md:px-7 md:py-8">
          <h1 className="text-[22px] font-bold text-white md:text-[26px]">Chính sách dịch vụ</h1>
          <p className="mt-2 text-[13px] text-blue-100 md:text-[14px]">
            TaiKhoanAI cam kết minh bạch trong mọi giao dịch — vui lòng đọc kỹ trước khi mua hàng.
          </p>
        </div>

        <div className="rounded-2xl border border-[#dbe2ef] bg-white px-5 py-6 md:px-7 md:py-8">

          <Section title="1. Chính sách bảo mật thông tin">
            <p>
              Chúng tôi coi trọng quyền riêng tư của bạn. Mọi thông tin cá nhân (tên, email, số điện thoại)
              chỉ được sử dụng để xử lý đơn hàng, hỗ trợ kỹ thuật và cải thiện dịch vụ — không chia sẻ cho bên thứ ba.
            </p>
            <p>
              Dữ liệu thanh toán được mã hóa và không lưu trữ trực tiếp trên hệ thống của chúng tôi.
            </p>
          </Section>

          <Section title="2. Chính sách bảo hành">
            <p className="font-semibold text-[#1c2e55]">Chúng tôi hỗ trợ bảo hành khi:</p>
            <ul className="ml-4 list-disc space-y-1">
              <li>Tài khoản không đăng nhập được ngay sau khi nhận</li>
              <li>Tài khoản sai thông tin so với mô tả sản phẩm</li>
              <li>Tài khoản bị lỗi kỹ thuật từ phía hệ thống gốc (không do người dùng gây ra)</li>
            </ul>
            <p className="font-semibold text-[#1c2e55] mt-3">Hình thức bảo hành:</p>
            <ul className="ml-4 list-disc space-y-1">
              <li>Đổi tài khoản mới tương đương</li>
              <li>Hoàn tiền nếu không có hàng thay thế</li>
            </ul>
            <div className="mt-3 rounded-lg border border-[#f5c6cb] bg-[#fff5f6] px-4 py-3 text-[#c0001e]">
              <strong>Không bảo hành</strong> trong các trường hợp: tài khoản bị khóa do vi phạm quy định nền tảng,
              spam, sử dụng sai mục đích hoặc tự ý thay đổi thông tin bảo mật gốc.
            </div>
          </Section>

          <Section title="3. Quy định sử dụng">
            <p className="font-semibold uppercase text-[#c0001e]">
              Nghiêm cấm sử dụng tài khoản mua tại TaiKhoanAI cho mục đích lừa đảo, mượn tiền, hoặc các hành vi
              vi phạm pháp luật. Chúng tôi không chịu bất kỳ trách nhiệm nào phát sinh từ việc sử dụng sai mục đích.
            </p>
            <p className="mt-2">Để tài khoản hoạt động ổn định, khuyến nghị:</p>
            <ul className="ml-4 list-disc space-y-1">
              <li>Không đăng nhập đồng thời trên nhiều thiết bị / IP khác nhau</li>
              <li>Không spam hoặc gửi tin nhắn hàng loạt bất thường</li>
              <li>Tuân thủ điều khoản sử dụng của nền tảng gốc (Zalo, Facebook, AI...)</li>
            </ul>
          </Section>

          <Section title="4. Thanh toán &amp; hoàn tiền">
            <p>Hiện tại chúng tôi chỉ hỗ trợ thanh toán qua:</p>
            <div className="mt-2">
              <Badge>Chuyển khoản ngân hàng</Badge>
            </div>
            <p className="mt-3">
              Sau khi chuyển khoản, số dư sẽ được cộng vào tài khoản trong vòng <strong>10 phút</strong>.
              Nếu quá thời gian trên mà chưa nhận được, vui lòng liên hệ bộ phận hỗ trợ ngay kèm ảnh xác nhận giao dịch.
            </p>
          </Section>

          <Section title="5. Thay đổi chính sách">
            <p>
              Chúng tôi có thể cập nhật chính sách này mà không cần thông báo trước. Mọi thay đổi sẽ được
              đăng tải trên trang này và có hiệu lực ngay khi được đăng. Việc tiếp tục sử dụng dịch vụ
              đồng nghĩa với việc bạn chấp nhận các thay đổi đó.
            </p>
          </Section>

        </div>
      </div>
    </main>
  );
}
