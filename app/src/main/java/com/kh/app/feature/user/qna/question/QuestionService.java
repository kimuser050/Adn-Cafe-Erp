package com.kh.app.feature.user.qna.question;

import com.kh.app.feature.user.qna.answer.AnswerFileVo;
import com.kh.app.feature.user.qna.answer.AnswerMapper;
import com.kh.app.feature.user.qna.answer.AnswerVo;
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
    private final AnswerMapper answerMapper; // 1. AnswerMapper

    @Value("${file.upload.path.question}")
    private String uploadPath;

    @Transactional
    public int insert(QuestionVo vo, List<MultipartFile> fileList) {

        // 1. 게시글 먼저 저장 (DB에서 INQUIRY_NO 자동 생성됨)
        int result = questionMapper.insert(vo);

        if (result != 1) {
            throw new RuntimeException("QNA 글 등록 실패");
        }

        // 2. 파일이 있을 때만 실행
        if (fileList != null && !fileList.isEmpty()) {

            // [중요] 방금 인서트된 게시글의 시퀀스 번호를 가져옴
            String currentNo = questionMapper.getCurrentSequence();

            for (MultipartFile file : fileList) {
                if (file.isEmpty()) continue;

                try {
                    String changeName = FileUploader.upload(file, uploadPath);

                    QuestionFileVo fvo = new QuestionFileVo();

                    // 위에서 가져온 번호를 파일 정보에 세팅
                    fvo.setInquiryNo(currentNo);
                    fvo.setOriginName(file.getOriginalFilename());
                    fvo.setChangeName(changeName);
                    fvo.setFilePath(uploadPath);

                    // 3. 파일 DB 저장
                    questionMapper.insertFile(fvo);

                } catch (Exception e) {
                    log.error("파일 업로드 실패", e);
                    throw new RuntimeException("파일 업로드 실패");
                }
            }
        }
        return result;
    }

    public int selectCount(String searchType, String searchKeyword) {
        return questionMapper.selectCount(searchType, searchKeyword);
    }

    public List<QuestionVo> selectList(PageVo pvo, String searchType, String searchKeyword) {
        return questionMapper.selectList(pvo, searchType, searchKeyword);
    }

    public QuestionVo selectOne(String no) {
        // 2-1. 문의글 본문 조회
        QuestionVo vo = questionMapper.selectOne(no);

        // 2-2. 문의글 첨부파일 조회
        List<QuestionFileVo> fileList = questionMapper.selectFileList(no);
        vo.setFileList(fileList);

        // [핵심] 2-3. 답변이 완료된 글('Y')이라면 답변 데이터도 가져오기
        if ("Y".equals(vo.getAnswerYn())) {
            // AnswerMapper를 사용하여 답변 정보 조회 (inquiryNo 기준)
            AnswerVo answerVo = answerMapper.selectOne(no);

            if (answerVo != null) {
                // 답변에 딸린 첨부파일 목록 조회 (replyNo 기준)
                List<AnswerFileVo> answerFiles = answerMapper.selectFileList(answerVo.getReplyNo());
                answerVo.setFileList(answerFiles);

                // QuestionVo 객체 안에 있는 answerVo 필드에 세팅
                vo.setAnswerVo(answerVo);
            }
        }

        return vo;
    }

    @Transactional
    public int deleteByNo(QuestionVo vo) {

        // 1 파일 삭제
        questionMapper.deleteFile(vo.getInquiryNo());

        // 2 게시글 삭제
        int result = questionMapper.deleteByNo(vo);

        return result;
    }
}
