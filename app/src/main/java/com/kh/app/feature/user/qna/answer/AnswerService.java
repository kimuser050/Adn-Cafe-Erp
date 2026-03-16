package com.kh.app.feature.user.qna.answer;

import com.kh.app.feature.util.FileUploader;
import com.kh.app.feature.util.PageVo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;

@Service
@Slf4j
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class AnswerService {

    private final AnswerMapper answerMapper;

    @Value("${file.upload.path.answer}")
    private String uploadPath;

    @Transactional
    public int insert(AnswerVo vo, List<MultipartFile> fileList) {

        // 1. 답변 INSERT
        int result = answerMapper.insert(vo);

        if(result != 1){
            throw new RuntimeException("답변 등록 실패");
        }

        // 2. 문의글 ANSWER_YN = 'Y'
        answerMapper.updateAnswerYn(vo.getInquiryNo());

        // 3. 파일 처리
        if(fileList != null && !fileList.isEmpty()){

            for(MultipartFile file : fileList){

                if(file.isEmpty()){
                    continue;
                }

                try {

                    // 파일 업로드
                    String changeName = FileUploader.upload(file , uploadPath);

                    // 파일 VO 생성
                    AnswerFileVo fvo = new AnswerFileVo();
                    fvo.setOriginName(file.getOriginalFilename());
                    fvo.setChangeName(changeName);
                    fvo.setFilePath(uploadPath);

                    // DB 저장
                    answerMapper.insertFile(fvo);

                } catch (Exception e){
                    log.error("파일 업로드 실패", e);
                    throw new RuntimeException("파일 업로드 실패");
                }

            }

        }

        return result;
    }

    public int selectCount() {
        return answerMapper.selectCount();
    }


    public List<AnswerVo> selectList(PageVo pvo) {

        return answerMapper.selectList(pvo);

    }

    public AnswerVo selectOne(String no) {

        AnswerVo vo = answerMapper.selectOne(no);

        List<AnswerFileVo> fileList = answerMapper.selectFileList(no);

        vo.setFileList(fileList);

        return vo;
    }

    @Transactional
    public int updateByNo(AnswerVo vo, MultipartFile file, String oldChangeName) throws IOException {

        // 1. 답변 내용 수정
        int result = answerMapper.updateByNo(vo);
        if(result != 1) {
            throw new IllegalStateException("[B-410] 답변 수정 실패");
        }

        // 2. 파일 처리
        if(file != null && !file.isEmpty()) {

            // 기존 DB 파일 삭제
            answerMapper.deleteFile(vo.getReplyNo());

            // 기존 서버 파일 삭제
            if(oldChangeName != null && !oldChangeName.isEmpty()) {
                File oldFile = new File(uploadPath, oldChangeName);
                if(oldFile.exists()) oldFile.delete();
            }

            // 새 파일 업로드
            String originName = file.getOriginalFilename();
            String newChangeName = FileUploader.upload(file, uploadPath);

            AnswerFileVo fvo = new AnswerFileVo();
            fvo.setReplyNo(vo.getReplyNo());
            fvo.setOriginName(originName);
            fvo.setChangeName(newChangeName);
            fvo.setFilePath(uploadPath);

            // DB 저장
            answerMapper.insertFile(fvo);
        }

        return result;
    }


}
