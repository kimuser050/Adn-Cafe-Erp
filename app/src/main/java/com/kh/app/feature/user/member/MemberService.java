package com.kh.app.feature.user.member;

import com.kh.app.feature.util.FileUploader;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class MemberService {

    @Value("${file.upload.path.member}")
    private String filePath;

    private final MemberMapper memberMapper;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    @Transactional
    public int join(MemberVo vo , MultipartFile profile) throws IOException {

        //valid
        checkValidation(vo);

        //save file
        if( profile != null && !profile.isEmpty()){
            String changeName = FileUploader.upload(profile, filePath);
            vo.setProfileChangeName(changeName);
            vo.setProfileOriginName(profile.getOriginalFilename());
        }

        //encrypt
        String encodedPw = bCryptPasswordEncoder.encode(vo.getEmpPw());
        vo.setEmpPw(encodedPw);

        return memberMapper.join(vo);
    }

    private void checkValidation(MemberVo vo){
        checkPwValid(vo.getEmpPw());
    }


    private void checkPwValid(String pw) {
        if(pw != null && pw.length() >= 4 && pw.length() <= 12){
            return;
        }
        throw new IllegalArgumentException("[M-102] pw length");
    }

    public MemberVo login(MemberVo vo) {
        if(vo.getEmpNo() == null || vo.getEmpPw() == null){
            return null;
        }
        MemberVo dbVo = memberMapper.selectByEmpNo(vo.getEmpNo());
        if(dbVo == null){
            return null;
        }

        boolean isMatch = bCryptPasswordEncoder.matches(vo.getEmpPw(), dbVo.getEmpPw());

        return isMatch ? dbVo : null;
    }

    @Transactional
    public int quit(String no) {
        return memberMapper.quit(no);

    }
    @Transactional
    public MemberVo edit(MemberVo vo, MultipartFile profile, String profileChangeName) throws IOException {

        checkEditValidation(vo);

        //비밀번호 암호화
        if(vo.getEmpPw() != null && !vo.getEmpPw().isEmpty()){
            String encodedPw = bCryptPasswordEncoder.encode(vo.getEmpPw());
            vo.setEmpPw(encodedPw);
        }

        //파일 저장
        if(profile != null && !profile.isEmpty()){
            String changeName = FileUploader.upload(profile, filePath);
            vo.setProfileChangeName(changeName);
            vo.setProfileOriginName(profile.getOriginalFilename());

            File oldFile = new File(filePath + profileChangeName);
            oldFile.delete();
        }

        int result = memberMapper.edit(vo);

        if(result != 1){
            return null;
        }

        return memberMapper.selectByNo(vo.getEmpNo());
    }


    private void checkEditValidation(MemberVo vo) {
        if(vo.getEmpPw() != null && !vo.getEmpPw().isEmpty()){ checkPwValid(vo.getEmpPw()); }
    }

    public MemberVo selectByNo(String empNo) {
        return memberMapper.selectByNo(empNo);
    }



}
