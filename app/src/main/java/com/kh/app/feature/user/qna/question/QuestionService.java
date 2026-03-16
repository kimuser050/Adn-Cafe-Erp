package com.kh.app.feature.user.qna.question;

import com.kh.app.feature.util.FileUploader;
import com.kh.app.feature.util.PageVo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@Slf4j
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class QuestionService {

    private final QuestionMapper questionMapper;

    @Value("${file.upload.path.question}")
    private String uploadPath;

    @Transactional
    public int insert(QuestionVo vo, List<MultipartFile> fileList) {

        // 1 글 INSERT
        int result = questionMapper.insert(vo);

        if (result != 1) {
            throw new RuntimeException("QNA 글 등록 실패");
        }

        // 2 파일이 있으면 처리
        if (fileList != null && !fileList.isEmpty()) {

            for (MultipartFile file : fileList) {

                if (file.isEmpty()) {
                    continue;
                }

                try {

                    // 3 파일 서버 저장
                    String changeName = FileUploader.upload(file, uploadPath);

                    // 4 파일 VO 생성
                    QuestionFileVo fvo = new QuestionFileVo();
                    fvo.setInquiryNo(vo.getInquiryNo());
                    fvo.setOriginName(file.getOriginalFilename());
                    fvo.setChangeName(changeName);
                    fvo.setFilePath(uploadPath);

                    // 5 파일 DB 저장
                    questionMapper.insertFile(fvo);

                } catch (Exception e) {
                    log.error("파일 업로드 실패", e);
                    throw new RuntimeException("파일 업로드 실패");
                }

            }

        }

        return result;
    }

    public int selectCount() {
        return questionMapper.selectCount();
    }


    public List<QuestionVo> selectList(PageVo pvo) {

        return questionMapper.selectList(pvo);

    }

    public QuestionVo selectOne(String no) {

        QuestionVo vo = questionMapper.selectOne(no);

        List<QuestionFileVo> fileList = questionMapper.selectFileList(no);

        vo.setFileList(fileList);

        return vo;
    }
}