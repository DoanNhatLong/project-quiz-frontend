export const buildTeacherPrompt = (topic, level, count = 20) => {
    const difficultyMap = {
        1: "Cơ bản (Junior) - Cú pháp và định nghĩa.",
        2: "Dưới trung bình - Áp dụng cơ bản.",
        3: "Trung bình (Intermediate) - Logic và thực tế.",
        4: "Trên trung bình - Tối ưu và Performance.",
        5: "Nâng cao (Senior) - Kiến trúc và Anti-patterns."
    };

    return `Bạn là Giảng viên Đại học có hơn 10 năm kinh nghiệm chuyên nghiên cứu và giảng dạy về lĩnh vực "${topic}". 
Hãy soạn ${count} câu hỏi trắc nghiệm để đánh giá năng lực sinh viên.
Độ khó: ${difficultyMap[level] || difficultyMap[3]}

YÊU CẦU NỘI DUNG CHI TIẾT:
1. ĐA DẠNG ĐÁP ÁN (BẮT BUỘC): 
   - Phải có ít nhất 3-4 câu hỏi là "Multiple Choice" (tức là có từ 2 ĐÁP ÁN ĐÚNG trở lên). 
   - Đừng chỉ tạo câu hỏi 1 đáp án đúng. Tôi cần kiểm tra kiến thức sâu của học viên.
2. Câu hỏi thực tế, có kèm code snippet (sử dụng ký tự \n cho xuống dòng trong JSON).
3. Các đáp án nhiễu phải cực kỳ logic để tránh học viên đoán mò.
4. KHÔNG ĐÁNH SỐ THỨ TỰ: Nội dung trường "content" chỉ chứa câu hỏi, tuyệt đối không bắt đầu bằng "Câu 1:", "Câu 2:", hay "1.", "2.".
5. XÁO TRỘN VỊ TRÍ (QUAN TRỌNG): Tuyệt đối không để đáp án đúng luôn nằm ở vị trí đầu tiên (A). Vị trí của các "is_correct": true phải ngẫu nhiên hoàn toàn trong mảng.
6. ĐỘ DÀI ĐÁP ÁN: Nội dung mỗi đáp án phải ngắn gọn, súc tích, tránh viết dài dòng gây nhiễu thị giác khi render.


ĐỊNH DẠNG TRẢ VỀ (BẮT BUỘC):
- Chỉ trả về duy nhất JSON array, không kèm lời dẫn.
QUAN TRỌNG, đây là yếu tố BẮT BUỘC Cấu trúc mẫu (nhưng hãy thay đổi is_correct tùy theo câu hỏi thực tế)
[
  {
    "content": "Nội dung câu hỏi...",
    "answers": [
      {"content": "Đáp án A", "is_correct": true},
      {"content": "Đáp án B", "is_correct": true}, 
      {"content": "Đáp án C", "is_correct": false},
      {"content": "Đáp án D", "is_correct": false}
    ]
  }
]`.trim();
};

export const buildTeacherPromptAcademic = (topic, difficulty, count = 20) => {
    const difficultyMap = {
        1: "Nhận biết: Ghi nhớ thuật ngữ, định nghĩa, mốc thời gian hoặc công thức cơ bản.",
        2: "Thông hiểu: Giải thích ý nghĩa, phân biệt các khái niệm tương đương.",
        3: "Vận dụng: Giải quyết các bài toán cụ thể hoặc áp dụng ngữ pháp vào tình huống.",
        4: "Phân tích & Tổng hợp: So sánh, tìm lỗi sai trong lập luận hoặc suy luận từ dữ liệu.",
        5: "Đánh giá: Nhận diện các trường hợp ngoại lệ, các giả thuyết phức tạp hoặc tư duy hệ thống."
    };

    const levelText = difficultyMap[difficulty] || difficultyMap[3];

    return `Bạn là Giáo sư, Giảng viên đại học ưu tú chuyên ngành "${topic}". 
Hãy soạn ${count} câu hỏi trắc nghiệm khách quan chuẩn học thuật để đưa vào đề thi kết thúc học phần.

Mục tiêu độ khó: ${levelText}

YÊU CẦU NỘI DUNG CHI TIẾT:
1. ĐẶC THÙ CHUYÊN MÔN:
   - Nếu là Ngoại ngữ (Anh, Nhật...): Tập trung vào ngữ pháp chuyên sâu, từ vựng theo ngữ cảnh (Contextual clues) hoặc tìm lỗi sai trong câu.
   - Nếu là Toán/Lý/Hóa: Đưa ra các bài toán có số liệu cụ thể, yêu cầu tư duy logic để tìm đáp án.
   - Nếu là Khoa học xã hội: Tập trung vào mối liên hệ nguyên nhân - kết quả, các học thuyết và thực tiễn.
2. ĐA DẠNG ĐÁP ÁN (BẮT BUỘC):
   - Phải có ít nhất 20% số câu hỏi là "Multiple Choice" (Có từ 2 đáp án đúng trở lên). 
   - Với các multi choice, hãy dùng các mẫu câu: "Những nhận định nào sau đây là đúng về...", "Chọn các đặc điểm của...", "Tập hợp các yếu tố bao gồm...".
   - Điều này nhằm kiểm tra kiến thức toàn diện, tránh việc sinh viên loại trừ đáp án.
3. CHẤT LƯỢNG ĐÁP ÁN NHIỄU:
   - Các đáp án sai phải có tính logic cao (ví dụ: các lỗi sai thường gặp, các công thức gần giống, các từ vựng dễ nhầm lẫn).
4. QUY TẮC TRÌNH BÀY:
   - KHÔNG đánh số thứ tự câu hỏi ở trường "content".
   - Nội dung đáp án ngắn gọn, súc tích, không viết dài dòng.
   - Sử dụng thuật ngữ chuyên môn chính xác.
5. CHỐNG THIÊN KIẾN ĐÁP ÁN A: Xáo trộn ngẫu nhiên vị trí đáp án đúng. Tuyệt đối không để đáp án đúng tập trung vào một vị trí cố định.

ĐỊNH DẠNG TRẢ VỀ (BẮT BUỘC):
- Chỉ trả về duy nhất JSON array, không kèm lời dẫn.
QUAN TRỌNG, đây là yếu tố BẮT BUỘC Cấu trúc mẫu (nhưng hãy thay đổi is_correct tùy theo câu hỏi thực tế)
[
  {
    "content": "Nội dung câu hỏi học thuật...",
    "answers": [
      {"content": "Đáp án A", "is_correct": true},
      {"content": "Đáp án B", "is_correct": false},
      {"content": "Đáp án C", "is_correct": false},
      {"content": "Đáp án D", "is_correct": true}
    ]
  }
]`.trim();
};
