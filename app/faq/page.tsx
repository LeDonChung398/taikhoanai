import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Câu hỏi thường gặp",
  description: "Giải đáp các câu hỏi thường gặp khi mua tài khoản số tại TaiKhoanAI."
};

const faqs: { q: string; a: React.ReactNode }[] = [
  {
    q: "Tài khoản số trên TaiKhoanAI là gì?",
    a: "Chúng tôi cung cấp các tài khoản số đã được đăng ký sẵn (AI tools, Zalo, Facebook, v.v.), có thể dùng ngay cho mục đích cá nhân, marketing, bán hàng hoặc chăm sóc khách hàng."
  },
  {
    q: "Tài khoản có đảm bảo chất lượng không?",
    a: (
      <ul className="ml-4 list-disc space-y-1">
        <li>Tài khoản hoạt động ổn định, đăng nhập được ngay sau khi mua</li>
        <li>Đã được kiểm tra kỹ trước khi bàn giao</li>
        <li>Có chính sách bảo hành rõ ràng theo từng loại sản phẩm</li>
      </ul>
    )
  },
  {
    q: "Sau khi mua tôi nhận tài khoản như thế nào?",
    a: "Sau khi thanh toán thành công, hệ thống tự động cấp tài khoản ngay lập tức. Thông tin đăng nhập hiển thị trực tiếp trên website và được gửi qua email."
  },
  {
    q: "Tôi có được đổi mật khẩu sau khi nhận không?",
    a: "Có. Bạn hoàn toàn có thể đổi mật khẩu và thông tin bảo mật để đảm bảo quyền riêng tư. Tuy nhiên lưu ý rằng một số loại tài khoản có thể mất bảo hành nếu thay đổi thông tin gốc — xem chi tiết ở mô tả sản phẩm."
  },
  {
    q: "Chính sách bảo hành như thế nào?",
    a: (
      <>
        <p>Bảo hành áp dụng khi tài khoản không đăng nhập được, sai mô tả, hoặc lỗi kỹ thuật từ hệ thống gốc. Hình thức:</p>
        <ul className="ml-4 mt-1 list-disc space-y-1">
          <li>Đổi tài khoản mới tương đương</li>
          <li>Hoàn tiền nếu không có hàng thay thế</li>
        </ul>
        <p className="mt-1 text-[#c0001e]">Không bảo hành nếu tài khoản bị khóa do spam hoặc vi phạm quy định nền tảng.</p>
      </>
    )
  },
  {
    q: "Tài khoản có bị khóa không?",
    a: (
      <>
        <p>Nếu sử dụng đúng cách, tài khoản sẽ hoạt động ổn định. Để tránh bị khóa:</p>
        <ul className="ml-4 mt-1 list-disc space-y-1">
          <li>Không spam hoặc gửi tin nhắn hàng loạt bất thường</li>
          <li>Không đăng nhập nhiều IP khác nhau cùng lúc</li>
          <li>Tuân thủ điều khoản sử dụng của nền tảng gốc</li>
        </ul>
      </>
    )
  },
  {
    q: "Tôi có thể mua số lượng lớn không?",
    a: "Hoàn toàn có thể. Chúng tôi cung cấp giá sỉ cho khách mua số lượng lớn với nguồn tài khoản ổn định, liên tục. Liên hệ hỗ trợ để được báo giá."
  },
  {
    q: "Phương thức thanh toán gồm những gì?",
    a: (
      <>
        <p>Hiện tại chúng tôi hỗ trợ thanh toán qua <strong>chuyển khoản ngân hàng</strong>.</p>
        <p className="mt-1">Sau khi chuyển khoản, vui lòng gửi ảnh xác nhận giao dịch qua kênh hỗ trợ để được xử lý nhanh nhất.</p>
      </>
    )
  },
  {
    q: "Nạp tiền bao lâu thì được cộng?",
    a: "Thông thường trong vòng 1–10 phút sau khi giao dịch được xác nhận. Nếu quá 10 phút chưa nhận được, vui lòng liên hệ hỗ trợ ngay kèm ảnh chụp màn hình giao dịch."
  },
  {
    q: "Làm sao để liên hệ hỗ trợ?",
    a: (
      <ul className="ml-4 list-disc space-y-1">
        <li>Chat trực tiếp qua Telegram hỗ trợ</li>
        <li>Hỗ trợ 24/24 — phản hồi mọi lúc</li>
      </ul>
    )
  }
];

export default function FaqPage() {
  return (
    <main className="site-container py-8 pb-14">
      <div className="mx-auto max-w-[820px]">
        {/* Hero */}
        <div className="mb-6 rounded-2xl bg-gradient-to-r from-[#1f3f8a] to-[#2b5ac8] px-5 py-6 md:px-7 md:py-8">
          <h1 className="text-[22px] font-bold text-white md:text-[26px]">Câu hỏi thường gặp</h1>
          <p className="mt-2 text-[13px] text-blue-100 md:text-[14px]">
            Tổng hợp các thắc mắc phổ biến khi mua tài khoản số tại TaiKhoanAI.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((item, idx) => (
            <div key={idx} className="rounded-xl border border-[#dbe2ef] bg-white px-4 py-4 md:px-6 md:py-5">
              <h2 className="flex items-start gap-2.5 text-[15px] font-bold text-[#1c2e55]">
                <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#1f4aab] text-[11px] font-bold text-white">
                  {idx + 1}
                </span>
                {item.q}
              </h2>
              <div className="mt-2.5 pl-[34px] text-[14px] leading-7 text-[#3a4d72]">{item.a}</div>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-xl border border-[#dbe2ef] bg-[#f8fbff] px-6 py-5 text-center text-[14px] text-[#3a4d72]">
          Còn câu hỏi khác? Liên hệ đội ngũ hỗ trợ qua{" "}
          <span className="font-bold text-[#1f4aab]">Telegram</span> — hỗ trợ <strong>24/24</strong>, phản hồi mọi lúc.
        </div>
      </div>
    </main>
  );
}
