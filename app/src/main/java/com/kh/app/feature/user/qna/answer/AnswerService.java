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
    public int insert(AnswerVo vo, List<MultipartFile> fList) { // 파라미터 2개로 축소

        String nextReplyNo = answerMapper.getNextReplyNo();
        vo.setReplyNo(nextReplyNo);

        int result = answerMapper.insert(vo);
        if(result != 1) throw new RuntimeException("답변 등록 실패");

        answerMapper.updateAnswerYn(vo.getInquiryNo());

        if(fList != null && !fList.isEmpty()) {
            for(MultipartFile f : fList) {
                if(!f.isEmpty()) {
                    try {
                        // 필드에 선언된 this.uploadPath를 명시적으로 사용
                        File dir = new File(this.uploadPath);
                        if(!dir.exists()) dir.mkdirs();

                        String changeName = FileUploader.upload(f, this.uploadPath);

                        AnswerFileVo fileVo = new AnswerFileVo();
                        fileVo.setOriginName(f.getOriginalFilename());
                        fileVo.setChangeName(changeName);
                        fileVo.setFilePath(this.uploadPath);
                        fileVo.setReplyNo(nextReplyNo);

                        answerMapper.insertFile(fileVo);
                    } catch (Exception e) {
                        log.error("파일 저장 중 진짜 에러: ", e); // 에러 원인을 로그로 찍어보세요!
                        throw new RuntimeException("파일 업로드 오류");
                    }
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

        // replyNo 기준으로 파일 조회
        List<AnswerFileVo> fileList = answerMapper.selectFileList(vo.getReplyNo());

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

    @Transactional
    public int deleteByNo(AnswerVo vo) {

        // 1. 첨부파일 조회
        var fileList = answerMapper.selectFileList(vo.getReplyNo());

        // 2. 답변 삭제 (DB DEL_YN = 'Y')
        int result = answerMapper.deleteByNo(vo);
        if(result != 1){
            throw new IllegalStateException("[B-510] 답변 삭제 실패");
        }

        // 3. 첨부파일 삭제 (DB DEL_YN = 'Y') 및 서버 파일 삭제
        for(var fvo : fileList){
            answerMapper.deleteFile(fvo.getFileNo());
            if(fvo.getChangeName() != null && !fvo.getChangeName().isEmpty()){
                File file = new File(uploadPath, fvo.getChangeName());
                if(file.exists()) file.delete();
            }
        }

        return result;
    }

}




