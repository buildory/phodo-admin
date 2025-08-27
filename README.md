# Phodo Admin Dashboard

Next.js 15와 Supabase를 활용한 현대적인 관리자 대시보드입니다.

## 🚀 기술 스택

- **Framework**: Next.js 15 (App Router)
- **Database**: Supabase
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Authentication**: Supabase Auth
- **Language**: TypeScript
- **Icons**: Lucide React

## ✨ 주요 기능

- 📊 **대시보드**: 실시간 통계 및 활동 모니터링
- 👥 **사용자 관리**: 사용자 목록, 권한 관리
- 📱 **앱 관리**: 앱 상태 모니터링 및 관리
- 📈 **분석**: 사용자 활동 및 성능 분석
- 🔐 **인증**: Supabase 기반 보안 인증
- 📱 **반응형**: 모바일 및 데스크톱 최적화

## 🛠️ 설치 및 실행

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env.local` 파일을 생성하고 다음 변수들을 설정하세요:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 📁 프로젝트 구조

```
src/
├── app/                    # Next.js App Router
│   ├── admin/             # 관리자 페이지
│   │   ├── page.tsx       # 대시보드
│   │   ├── users/         # 사용자 관리
│   │   ├── apps/          # 앱 관리
│   │   └── analytics/     # 분석
│   ├── login/             # 로그인 페이지
│   └── layout.tsx         # 루트 레이아웃
├── components/            # React 컴포넌트
│   ├── ui/               # shadcn/ui 컴포넌트
│   └── layout/           # 레이아웃 컴포넌트
├── lib/                  # 유틸리티 함수
│   ├── supabase.ts       # Supabase 클라이언트
│   ├── auth.ts           # 인증 관련 함수
│   └── utils.ts          # 공통 유틸리티
└── types/                # TypeScript 타입 정의
    └── database.ts       # 데이터베이스 타입
```

## 🔧 Supabase 설정

### 1. 테이블 생성

다음 SQL을 Supabase SQL Editor에서 실행하세요:

```sql
-- 사용자 프로필 테이블
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 앱 데이터 테이블
CREATE TABLE apps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'maintenance')),
  version TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 분석 데이터 테이블
CREATE TABLE analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  app_id UUID REFERENCES apps(id),
  metric_name TEXT NOT NULL,
  metric_value NUMERIC NOT NULL,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS (Row Level Security) 설정
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE apps ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

-- 정책 설정
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON profiles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can manage apps" ON apps
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can view analytics" ON analytics
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

### 2. 트리거 함수 생성

```sql
-- 사용자 생성 시 프로필 자동 생성
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, name, role)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'name', 'user');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE handle_new_user();
```

## 🎨 커스터마이징

### 테마 변경

`src/app/globals.css`에서 CSS 변수를 수정하여 테마를 변경할 수 있습니다:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;
  /* ... */
}
```

### 컴포넌트 추가

새로운 shadcn/ui 컴포넌트를 추가하려면:

```bash
npx shadcn@latest add [component-name]
```

## 📱 반응형 디자인

이 프로젝트는 모바일, 태블릿, 데스크톱을 모두 지원합니다:

- **모바일**: 사이드바가 슬라이드 메뉴로 변환
- **태블릿**: 적응형 그리드 레이아웃
- **데스크톱**: 전체 사이드바 및 최적화된 레이아웃

## 🔒 보안

- Supabase RLS (Row Level Security) 적용
- 서버 사이드 인증 검증
- 환경 변수를 통한 민감 정보 보호
- HTTPS 강제 적용 (프로덕션)

## 🚀 배포

### Vercel 배포

1. GitHub에 코드 푸시
2. Vercel에서 프로젝트 연결
3. 환경 변수 설정
4. 배포 완료

### 기타 플랫폼

```bash
npm run build
npm start
```

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 📞 지원

문제가 있거나 질문이 있으시면 이슈를 생성해 주세요.
