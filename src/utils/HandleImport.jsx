import * as XLSX from "xlsx";

export const HandleImport = (file, quizId) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (evt) => {
            try {
                const bstr = evt.target.result;
                const wb = XLSX.read(bstr, { type: 'binary' });
                const ws = wb.Sheets[wb.SheetNames[0]];
                const data = XLSX.utils.sheet_to_json(ws, { header: 1 });

                // Lọc bỏ tiêu đề (dòng 0) và dòng trống ở cột nội dung (index 1)
                const rows = data.slice(1).filter(row => row.length > 0 && row[1]);

                const listPayload = rows.map((row, index) => {
                    const correctStr = String(row[6] || "").trim();
                    const correctIndexes = correctStr.split(',').map(s => parseInt(s.trim()));

                    return {
                        quiz_id: parseInt(quizId),
                        content: row[1], // Cột B
                        order_index: index + 1,
                        type: correctIndexes.length > 1 ? 'multiple' : 'single',
                        answers: [
                            { content: String(row[2] || ""), is_correct: correctIndexes.includes(1) },
                            { content: String(row[3] || ""), is_correct: correctIndexes.includes(2) },
                            { content: String(row[4] || ""), is_correct: correctIndexes.includes(3) },
                            { content: String(row[5] || ""), is_correct: correctIndexes.includes(4) }
                        ]
                    };
                });

                resolve(listPayload);
            } catch (error) {
                reject("Lỗi định dạng file Excel!");
                console.error(error);
            }
        };

        reader.onerror = () => reject("Không thể đọc file!");
        reader.readAsBinaryString(file);
    });
};