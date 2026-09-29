import * as r from "react";
import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { HugeiconsIcon } from "@hugeicons/react";
import hiHelloAnimation from "./assets/hi-hello.json";
import ClassroomPlayer from "./ClassroomPlayer.jsx";
import {
  Search01Icon,
  FilterIcon,
  Cancel01Icon,
  Edit02Icon,
  Delete02Icon,
  Add01Icon,
  Moon02Icon,
  Sun03Icon,
  ThumbsUpIcon,
  Award01Icon,
  Quiz01Icon,
  Home01Icon,
  BookOpen01Icon,
  UserGroupIcon,
  ChartHistogramIcon,
  Notification01Icon,
  UserCircleIcon,
  Logout01Icon,
  Download01Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  PlayIcon,
  Menu01Icon,
  RefreshIcon,
  CheckmarkCircle02Icon,
  Medal01Icon,
  RankingIcon,
  SparklesIcon,
  Settings02Icon,
  ViewIcon,
  File01Icon,
  LockPasswordIcon,
  ArrowDown01Icon,
  Analytics01Icon,
  Pin02Icon,
} from "@hugeicons/core-free-icons";

const i = { jsx, jsxs, Fragment };
function Icon({ icon, size = 18, className = ``, strokeWidth = 1.7 }) {
  if (!icon) return null;
  return (
    <HugeiconsIcon
      icon={icon}
      size={size}
      color="currentColor"
      strokeWidth={strokeWidth}
      className={className}
    />
  );
}
function NoticePin({ label = false }) {
  return <span className={`notice-pin ${label ? `notice-pin-label` : ``}`} aria-label="중요 공지">
    <Icon icon={Pin02Icon} size={label ? 25 : 22} strokeWidth={1.9} />
  </span>;
}
function WishlistHeart({ filled = false, size = 27 }) {
  return <svg
    className={`wishlist-heart-icon ${filled ? `filled` : ``}`}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path
      d="M12 20.35C10.9 19.34 5.15 15.05 3.12 11.34C1.35 8.1 2.72 4.5 6.15 3.76C8.22 3.31 10.18 4.13 12 6.03C13.82 4.13 15.78 3.31 17.85 3.76C21.28 4.5 22.65 8.1 20.88 11.34C18.85 15.05 13.1 19.34 12 20.35Z"
      fill={filled ? `currentColor` : `none`}
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>;
}
function userLevelLabel(level = ``) {
  const number = String(level).match(/\d+/)?.[0];
  return number ? `LV.${number}` : level;
}
function userLevelTone(level = ``) {
  const number = String(level).match(/\d+/)?.[0] || `1`;
  return `level-${number}`;
}
function userRecruitTone(status = ``) {
  const label = userCourseStatus(status);
  if (label === `오픈 전`) return `pre-open`;
  if (label === `운영 중`) return `operating`;
  return `ended`;
}
function userCourseStatus(status = ``) {
  if ([`오픈 전`, `모집 예정`].includes(status)) return `오픈 전`;
  if ([`운영 중`, `모집 중`, `마감 임박`].includes(status)) return `운영 중`;
  return `종료`;
}
function CourseStatusBadge({ status, className = `` }) {
  const label = userCourseStatus(status);
  return <span className={`course-status-badge ${userRecruitTone(status)} ${className}`}>{label}</span>;
}
function courseCtaState(course) {
  const status = userCourseStatus(course?.status);
  const completed = isCourseCompleted(course);
  if (completed) return { label: `수료증 확인`, action: `certificate`, disabled: false };
  if (status === `오픈 전`) return { label: `오픈 전`, action: `none`, disabled: true };
  if (status === `종료` && !course?.enrolled) return { label: `종료된 과정`, action: `none`, disabled: true };
  if (course?.enrolled) return { label: `강의실 입장`, action: `enter`, disabled: false };
  return { label: `수강 신청`, action: `enroll`, disabled: false };
}
function assignmentDeadlineLabel(deadline) {
  if (!deadline) return ``;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(`${deadline}T00:00:00`);
  const days = Math.ceil((due - today) / 86400000);
  if (days < 0) return `기한 초과`;
  if (days === 0) return `오늘 마감`;
  return `D-${days}`;
}
function deadlineTone(deadline) {
  if (!deadline) return `neutral`;
  const today = new Date(); today.setHours(0,0,0,0);
  const days = Math.ceil((new Date(`${deadline}T00:00:00`) - today) / 86400000);
  return days <= 0 ? `danger` : days <= 3 ? `urgent` : `neutral`;
}
function courseSurveyEnabled(course) { return course?.surveyEnabled !== false; }
function isCourseCompleted(course) {
  if (!course) return false;
  return course.enrollmentStatus === `COMPLETED` || Boolean(course.completedAt || course.certificateNumber);
}
function RequiredTrainingBadge({ deadline, compact = false, completed = false }) {
  const due = completed ? `수료 완료` : assignmentDeadlineLabel(deadline);
  const tone = completed ? `complete` : deadlineTone(deadline);
  return <span className={`required-training-badge ${tone} ${compact ? `compact` : ``}`}><Icon icon={CheckmarkCircle02Icon} size={compact ? 13 : 14} />{completed ? due : `필수 교육${due ? ` · ${due}` : ``}`}</span>;
}
function showAdminToast(message, tone = `success`) {
  window.dispatchEvent(new CustomEvent(`sparkplus-admin-toast`, { detail: { message, tone } }));
}
function AdminToastHost() {
  const [toast, setToast] = r.useState(null);
  r.useEffect(() => {
    const show = (event) => setToast({ ...event.detail, id: Date.now() });
    window.addEventListener(`sparkplus-admin-toast`, show);
    return () => window.removeEventListener(`sparkplus-admin-toast`, show);
  }, []);
  r.useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(null), 2600);
    return () => window.clearTimeout(timer);
  }, [toast]);
  return toast ? <div className={`admin-global-toast ${toast.tone || `success`}`} role="status"><span>{toast.tone === `error` ? `!` : <Icon icon={CheckmarkCircle02Icon} size={18} />}</span>{toast.message}</div> : null;
}
function ConfirmModal({ title, description, confirmLabel = `확인`, tone = `danger`, onCancel, onConfirm }) {
  return <div className="overlay center admin-confirm-overlay" onMouseDown={(event) => event.target === event.currentTarget && onCancel()}><section className="admin-confirm-modal" role="alertdialog" aria-modal="true"><div className={`admin-confirm-icon ${tone}`}>{tone === `danger` ? `!` : <Icon icon={CheckmarkCircle02Icon} size={23} />}</div><h2>{title}</h2><p>{description}</p><div><button className="secondary" onClick={onCancel}>취소</button><button className={tone === `danger` ? `danger` : `primary`} onClick={onConfirm}>{confirmLabel}</button></div></section></div>;
}
function lottiePath(shape) {
  if (!shape?.v?.length) return ``;
  const point = (value) => `${Number(value[0].toFixed(3))} ${Number(value[1].toFixed(3))}`;
  let path = `M ${point(shape.v[0])}`;
  for (let index = 1; index < shape.v.length; index += 1) {
    const previous = index - 1;
    const c1 = [shape.v[previous][0] + shape.o[previous][0], shape.v[previous][1] + shape.o[previous][1]];
    const c2 = [shape.v[index][0] + shape.i[index][0], shape.v[index][1] + shape.i[index][1]];
    path += ` C ${point(c1)} ${point(c2)} ${point(shape.v[index])}`;
  }
  if (shape.c) {
    const last = shape.v.length - 1;
    path += ` C ${point([shape.v[last][0] + shape.o[last][0], shape.v[last][1] + shape.o[last][1]])} ${point([shape.v[0][0] + shape.i[0][0], shape.v[0][1] + shape.i[0][1]])} ${point(shape.v[0])} Z`;
  }
  return path;
}
function HomeGreetingSticker() {
  const handRef = r.useRef(null);
  const layer = hiHelloAnimation.layers[0];
  const paths = layer.shapes.map((group) => ({
    d: lottiePath(group.it.find((item) => item.ty === `sh`)?.ks?.k),
    fill: group.it.find((item) => item.ty === `fl`)?.c?.k,
  }));
  r.useEffect(() => {
    if (!handRef.current || matchMedia(`(prefers-reduced-motion: reduce)`).matches) return;
    const rotation = layer.ks.r.k;
    const endFrame = hiHelloAnimation.op - hiHelloAnimation.ip;
    const animation = handRef.current.animate(
      rotation.map((frame) => ({ transform: `rotate(${frame.s[0]}deg)`, offset: frame.t / endFrame })),
      { duration: (endFrame / hiHelloAnimation.fr) * 1000, iterations: Infinity, easing: `ease-in-out` },
    );
    return () => animation.cancel();
  }, []);
  const color = (values) => `rgb(${values.slice(0, 3).map((value) => Math.round(value * 255)).join(`,`)})`;
  return <svg viewBox="-380 -430 760 860" role="img" aria-label="손 흔드는 인사 애니메이션">
    <g ref={handRef} className="home-greeting-hand">
      {paths.map((path, index) => <path key={index} fill={color(path.fill)} d={path.d} />)}
    </g>
  </svg>;
}
function SearchFilterPanel({
  value,
  onValueChange,
  placeholder,
  filters = [],
  onSearch,
  onReset,
  quickTags = [],
  onQuickTag,
  variant = `default`,
}) {
  return (
    <section className={`search-filter-panel ${variant}`}>
      <label className="search-filter-input">
        <Icon icon={Search01Icon} size={20} />
        <input
          value={value}
          onChange={(event) => onValueChange(event.target.value)}
          onKeyDown={(event) => event.key === `Enter` && onSearch?.()}
          placeholder={placeholder}
        />
      </label>
      <div className="search-filter-row">
        <div className="search-filter-selects">
          {filters.map((filter) => (
            <select
              key={filter.label || filter.options[0]}
              aria-label={filter.label || filter.options[0]}
              value={filter.value}
              onChange={(event) => filter.onChange(event.target.value)}
            >
              {filter.options.map((option) => {
                const normalized = typeof option === `string` ? { value: option, label: option } : option;
                return <option key={normalized.value} value={normalized.value}>{normalized.label}</option>;
              })}
            </select>
          ))}
        </div>
        <div className="search-filter-actions">
          <button className="search-filter-reset" onClick={onReset}>
            <Icon icon={RefreshIcon} size={19} />
            초기화
          </button>
          <button className="search-filter-submit" onClick={onSearch}>
            <Icon icon={Search01Icon} size={19} />
            검색
          </button>
        </div>
      </div>
      {!!quickTags.length && (
        <div className="search-filter-quick">
          <span><Icon icon={FilterIcon} size={15} />빠른 선택</span>
          {quickTags.map((tag) => (
            <button key={tag} onClick={() => onQuickTag?.(tag)}>#{tag}</button>
          ))}
        </div>
      )}
    </section>
  );
}
function menuIcon(label) {
  if (label.includes(`홈`) || label.includes(`대시보드`)) return Home01Icon;
  if (label.includes(`리워드`)) return RankingIcon;
  if (label.includes(`교육과정`) || label.includes(`학습`))
    return BookOpen01Icon;
  if (label.includes(`학습자`) || label.includes(`회원`)) return UserGroupIcon;
  if (label.includes(`공지`)) return Notification01Icon;
  if (label.includes(`통계`) || label.includes(`성과`))
    return ChartHistogramIcon;
  if (label.includes(`랭킹`)) return RankingIcon;
  if (label.includes(`퀴즈`)) return Quiz01Icon;
  if (label.includes(`반응`)) return ThumbsUpIcon;
  return Settings02Icon;
}
var a = [
    {
      id: 1,
      title: `데이터 분석 기초 입문`,
      category: `직무역량`,
      period: `2026.08.01 ~ 09.30`,
      lessons: 5,
      learners: 84,
      status: `운영 중`,
      rate: 68,
    },
    {
      id: 2,
      title: `처음 맡는 팀장을 위한 리더십`,
      category: `리더십`,
      period: `2026.08.18 ~ 10.10`,
      lessons: 6,
      learners: 32,
      status: `오픈 전`,
      rate: 0,
    },
    {
      id: 3,
      title: `생성형 AI 업무 활용`,
      category: `AX`,
      period: `2026.09.01 ~ 11.30`,
      lessons: 8,
      learners: 126,
      status: `오픈 전`,
      rate: 0,
    },
    {
      id: 4,
      title: `개인정보보호 필수교육`,
      category: `법정필수`,
      period: `2026.03.01 ~ 06.30`,
      lessons: 4,
      learners: 214,
      status: `종료`,
      rate: 82,
    },
  ],
  o = [
    {
      id: `SP1024`,
      name: `김수민`,
      dept: `People팀`,
      position: `인턴`,
      courses: 4,
      progress: 72,
      completed: 2,
      status: `재직`,
    },
    {
      id: `SP0988`,
      name: `이지은`,
      dept: `마케팅팀`,
      position: `매니저`,
      courses: 5,
      progress: 88,
      completed: 4,
      status: `재직`,
    },
    {
      id: `SP0761`,
      name: `박서준`,
      dept: `개발팀`,
      position: `팀장`,
      courses: 3,
      progress: 46,
      completed: 1,
      status: `재직`,
    },
    {
      id: `SP1142`,
      name: `최하늘`,
      dept: `세일즈팀`,
      position: `매니저`,
      courses: 6,
      progress: 61,
      completed: 3,
      status: `재직`,
    },
    {
      id: `SP1057`,
      name: `정유진`,
      dept: `운영팀`,
      position: `파트장`,
      courses: 4,
      progress: 95,
      completed: 4,
      status: `재직`,
    },
  ],
  s = [
    {
      id: 1,
      title: `2026년 하반기 법정필수교육 수강 안내`,
      category: `필수`,
      date: `2026.08.05`,
      views: 186,
    },
    {
      id: 2,
      title: `LMS 서비스 점검 안내`,
      category: `시스템`,
      date: `2026.08.02`,
      views: 94,
    },
    {
      id: 3,
      title: `신규 리더십 과정 오픈 안내`,
      category: `과정`,
      date: `2026.07.29`,
      views: 121,
    },
  ],
  c = [
    { label: `홈`, page: `home` },
    { label: `교육과정 관리`, page: `courses` },
    { label: `학습자 관리`, page: `learners` },
    { label: `학습 현황`, page: `learningStatus` },
    { label: `학습 리워드`, page: `rewards` },
    { label: `공지사항 관리`, page: `notices` },
  ],
  l = {
    home: [`관리자 홈`, `사내 교육 운영 현황을 한눈에 확인하세요.`],
    courses: [
      `교육과정 목록`,
      `등록된 교육과정을 조회하고 등록·수정·삭제할 수 있습니다.`,
    ],
    content: [
      `교육과정 관리`,
      `과정 정보와 콘텐츠, 차시 및 수료 기준을 한곳에서 관리합니다.`,
    ],
    learners: [
      `전체 학습자 관리`,
      `부서별 학습 현황과 소속 임직원의 학습 정보를 확인합니다.`,
    ],
    learningStatus: [`학습 현황`, `기간별 수강 신청과 학습 완료 기록을 강의·학습자 단위로 확인합니다.`],
    learnerDetail: [
      `학습자 상세`,
      `개인별 수강 과정과 학습 진행 정보를 확인합니다.`,
    ],
    rewards: [`학습 리워드`, `학습 포인트를 기반으로 랭킹과 뱃지 지급 현황을 관리합니다.`],
    assignments: [
      `교육 배정 관리`,
      `개인·부서·직급별 교육과정을 배정하고 필수 여부를 설정합니다.`,
    ],
    completion: [`수료 현황`, `수료자와 미수료자를 구분하여 관리합니다.`],
    surveys: [`설문 관리`, `과정별 만족도 설문과 응답 현황을 관리합니다.`],
    statistics: [`교육 통계`, `교육 참여와 수료 성과를 지표로 확인합니다.`],
    rankings: [`학습 랭킹`, `월간·연간 학습 순위와 리워드 대상을 확인합니다.`],
    engagement: [
      `강의 반응`,
      `좋아요와 수강 데이터를 바탕으로 인기 강의를 확인합니다.`,
    ],
    quizAdmin: [`퀴즈 관리`, `강의별 AI 퀴즈와 학습자 결과를 관리합니다.`],
    notices: [
      `공지사항 관리`,
      `임직원에게 노출되는 공지사항을 등록하고 관리합니다.`,
    ],
    profile: [`관리자 프로필`, `관리자 정보와 비밀번호를 안전하게 관리합니다.`],
  };
function u({ children: e, tone: t = `mint` }) {
  return (0, i.jsx)(`span`, { className: `badge ${t}`, children: e });
}
function d({ value: e }) {
  return (0, i.jsx)(`div`, {
    className: `progress ${e >= 80 ? `high` : e >= 50 ? `middle` : `low`}`,
    children: (0, i.jsx)(`span`, { style: { width: `${e}%` } }),
  });
}
function f({ logout: e, user, switchToLearner }) {
  let [theme, setTheme] = (0, r.useState)(
    () => localStorage.getItem(`sparkplus-theme`) || `light`,
  );
  (0, r.useEffect)(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(`sparkplus-theme`, theme);
  }, [theme]);
  let [t, n] = (0, r.useState)(`home`),
    [s, u] = (0, r.useState)(null),
    [d, f] = (0, r.useState)(``),
    [m, h] = (0, r.useState)(`전체 소속`),
    [g, O] = (0, r.useState)(`전체 직급`),
    [k, A] = (0, r.useState)(null),
    [j, M] = (0, r.useState)(null),
    [N, P] = (0, r.useState)(`전체`),
    [F, I] = (0, r.useState)(!1),
    [noticeCreateSignal, setNoticeCreateSignal] = (0, r.useState)(0),
    [L, R] = (0, r.useState)(a[0]),
    [isNewCourse, setIsNewCourse] = (0, r.useState)(false),
    z = (0, r.useMemo)(
      () =>
        o.filter(
          (e) =>
            (e.name.includes(d) ||
              e.id.toLowerCase().includes(d.toLowerCase()) ||
              e.dept.toLowerCase().includes(d.toLowerCase())) &&
            (m === `전체 소속` || e.dept === m) &&
            (g === `전체 직급` || e.position === g),
        ),
      [d, m, g],
    ),
    B = (e) => {
      (n(e), u(null), I(!1), A(null));
    };
  return (0, i.jsxs)(`div`, {
    className: `admin-portal app-shell`,
    children: [
      (0, i.jsxs)(`header`, {
        className: `topbar`,
        children: [
          (0, i.jsxs)(`button`, {
            className: `brand`,
            onClick: () => B(`home`),
            children: [
              (0, i.jsx)(`img`, {
                className: `brand-logo`,
                src: `https://sparkplus-lms-prototype.min20993.chatgpt.site/sparkplus-logo-black.png`,
                alt: `SPARKPLUS`,
              }),
              (0, i.jsx)(`span`, { className: `brand-lms`, children: `LMS` }),
              (0, i.jsx)(`em`, { children: `ADMIN` }),
            ],
          }),
          (0, i.jsx)(`nav`, {
            className: `main-nav`,
            "aria-label": `관리자 메뉴`,
            children: c.map((e) =>
              (0, i.jsxs)(
                `div`,
                {
                  className: `nav-wrap`,
                  onMouseEnter: () => e.items && u(e.label),
                  onMouseLeave: () => e.items && u(null),
                  children: [
                    (0, i.jsx)(`button`, {
                      className: `nav-button ${e.page === t || (e.page === `courses` && t === `content`) || (e.page === `learners` && t === `learnerDetail`) || e.items?.some((e) => e.page === t) ? `active` : ``}`,
                      onClick: () =>
                        e.page ? B(e.page) : u(s === e.label ? null : e.label),
                      children: [
                        (0, i.jsx)(Icon, { icon: menuIcon(e.label) }),
                        (0, i.jsx)(`span`, { children: e.label }),
                      ],
                    }),
                    e.items &&
                      s === e.label &&
                      (0, i.jsx)(`div`, {
                        className: `dropdown`,
                        children: e.items.map((e) =>
                          (0, i.jsx)(
                            `button`,
                            {
                              onClick: () => B(e.page),
                              className: t === e.page ? `selected` : ``,
                              children: e.label,
                            },
                            e.page,
                          ),
                        ),
                      }),
                  ],
                },
                e.label,
              ),
            ),
          }),
          (0, i.jsx)(`button`, {
            className: `theme-toggle`,
            onClick: () => setTheme(theme === `light` ? `dark` : `light`),
            title: `라이트·다크 모드 전환`,
            children: (0, i.jsx)(Icon, {
              icon: theme === `light` ? Moon02Icon : Sun03Icon,
              size: 20,
            }),
          }),
          (0, i.jsxs)(`button`, {
            className: `portal-switch-button`,
            type: `button`,
            onClick: switchToLearner,
            title: `학습자 화면으로 전환`,
            children: [
              (0, i.jsx)(Icon, { icon: BookOpen01Icon, size: 18 }),
              (0, i.jsx)(`span`, { children: `학습자 화면` }),
            ],
          }),
          (0, i.jsxs)(`div`, {
            className: `profile-wrap`,
            children: [
              (0, i.jsxs)(`button`, {
                className: `profile-button`,
                onClick: () => I(!F),
                children: [
                  (0, i.jsx)(`span`, { className: `avatar`, children: `관` }),
                  (0, i.jsxs)(`span`, {
                    children: [
                      (0, i.jsx)(`b`, { children: user?.name || `관리자` }),
                      (0, i.jsx)(`small`, { children: user?.email || `LMS 관리자` }),
                    ],
                  }),
                ],
              }),
              F &&
                (0, i.jsxs)(`div`, {
                  className: `profile-menu`,
                  children: [
                    (0, i.jsx)(`button`, {
                      onClick: () => B(`profile`),
                      children: `프로필 수정`,
                    }),
                    (0, i.jsx)(`button`, {
                      onClick: () => B(`profile`),
                      children: `계정 정보`,
                    }),
                    (0, i.jsx)(`hr`, {}),
                    (0, i.jsx)(`button`, { onClick: e, children: `로그아웃` }),
                  ],
                }),
            ],
          }),
        ],
      }),
      (0, i.jsxs)(`main`, {
        className: `main ${t === `home` ? `admin-home-main` : t === `courses` ? `admin-courses-main` : t === `learners` ? `admin-learners-main` : [`learningStatus`, `rewards`, `notices`, `content`].includes(t) ? `admin-results-main` : ``}`,
        children: [
          ![`content`, `learnerDetail`, `notices`].includes(t) &&
            (0, i.jsx)(PageHeader, {
              kicker: l[t][0],
              title: l[t][0],
              description: l[t][1],
              action:
                t === `notices`
                  ? (0, i.jsxs)(`button`, {
                      className: `primary`,
                      onClick: () => setNoticeCreateSignal((value) => value + 1),
                      children: [(0, i.jsx)(Icon, { icon: Add01Icon }), `공지사항 등록`],
                    })
                  : null,
            }),
          t === `home` && (0, i.jsx)(p, { onGo: B }),
          t === `courses` &&
            (0, i.jsx)(CourseAdminGrid, {
              onCreate: () => {
                R({ id: `new`, title: `새 교육과정`, category: `직무역량`, status: `오픈 전`, lessons: 1, learners: 0, rate: 0, curriculum: null });
                setIsNewCourse(true);
                B(`content`);
              },
              onEdit: (e) => {
                (R(e), setIsNewCourse(false), B(`content`));
              },
            }),
          t === `content` &&
            (0, i.jsx)(CourseEditorV2, {
              selected: L,
              isNew: isNewCourse,
              onBack: () => B(`courses`),
            }),
          t === `learners` &&
            (0, i.jsx)(DatabaseLearnerManagement, {
              onSelect: (learner) => {
                B(`learnerDetail`);
                A(learner);
              },
            }),
          t === `learningStatus` && (0, i.jsx)(AdminLearningStatusPage, {}),
          t === `learnerDetail` &&
            k &&
            (0, i.jsx)(LearnerProfilePage, {
              learner: k,
              onBack: () => B(`learners`),
              onUpdate: (learner) => A(learner),
            }),
          t === `assignments` &&
            (0, i.jsx)(x, { onCreate: () => M(`교육과정 배정`) }),
          t === `rewards` && (0, i.jsx)(LearningRewardsPage, {}),
          t === `completion` && (0, i.jsx)(S, { tab: N, setTab: P }),
          t === `surveys` && (0, i.jsx)(C, {}),
          t === `statistics` && (0, i.jsx)(w, {}),
          t === `rankings` && (0, i.jsx)(Qe, { type: `ranking` }),
          t === `engagement` && (0, i.jsx)(Qe, { type: `engagement` }),
          t === `quizAdmin` && (0, i.jsx)(Qe, { type: `quiz` }),
          t === `notices` && (0, i.jsx)(T, { createSignal: noticeCreateSignal }),
          t === `profile` && (0, i.jsx)(E, {}),
        ],
      }),
      j && (0, i.jsx)(D, { title: j, onClose: () => M(null) }),
      (0, i.jsx)(AdminToastHost, {}),
    ],
  });
}
const padDatePart = (value) => String(value).padStart(2, `0`);
const toDateValue = (date) => `${date.getFullYear()}-${padDatePart(date.getMonth() + 1)}-${padDatePart(date.getDate())}`;
const endOfMonthValue = (year, month) => toDateValue(new Date(year, month, 0));
const ADMIN_TODAY = new Date(2026, 7, 18);
const adminQuickRange = (key) => {
  const year = ADMIN_TODAY.getFullYear();
  const month = ADMIN_TODAY.getMonth();
  if (key === `lastMonth`) return { start: toDateValue(new Date(year, month - 1, 1)), end: endOfMonthValue(year, month), label: `지난달` };
  if (key === `threeMonths`) return { start: toDateValue(new Date(year, month - 2, 1)), end: endOfMonthValue(year, month + 1), label: `최근 3개월` };
  if (key === `sixMonths`) return { start: toDateValue(new Date(year, month - 5, 1)), end: endOfMonthValue(year, month + 1), label: `최근 6개월` };
  if (key === `year`) return { start: `${year}-01-01`, end: `${year}-12-31`, label: `올해` };
  if (key === `quarter`) {
    const quarterStart = Math.floor(month / 3) * 3;
    return { start: toDateValue(new Date(year, quarterStart, 1)), end: endOfMonthValue(year, quarterStart + 3), label: `${year}년 ${Math.floor(month / 3) + 1}분기` };
  }
  return { start: toDateValue(new Date(year, month, 1)), end: endOfMonthValue(year, month + 1), label: `이번 달` };
};
const formatAdminPeriod = ({ start, end }) => start.slice(0, 7) === end.slice(0, 7)
  ? `${Number(start.slice(0, 4))}년 ${Number(start.slice(5, 7))}월`
  : `${start.replaceAll(`-`, `.`)} ~ ${end.replaceAll(`-`, `.`)}`;

function openNativeDatePicker(event) {
  try {
    event.currentTarget.showPicker?.();
  } catch {
    // Browsers without showPicker still provide their native date control.
  }
}

function DateRangeFilter({ value, onChange, mode = `dashboard` }) {
  const options = mode === `ranking`
    ? [[`month`, `월간`], [`quarter`, `분기`], [`year`, `올해`], [`custom`, `직접 설정`]]
    : [[`month`, `이번 달`], [`lastMonth`, `지난달`], [`threeMonths`, `최근 3개월`], [`sixMonths`, `최근 6개월`], [`year`, `올해`], [`custom`, `직접 선택`]];
  const invalid = !value.start || !value.end || value.start > value.end;
  const selectPreset = (key) => {
    if (key === `custom`) return onChange({ ...value, preset: key });
    const normalizedKey = key === `month` ? `month` : key;
    onChange({ preset: key, ...adminQuickRange(normalizedKey) });
  };
  return <div className={`admin-date-range-filter ${invalid ? `has-error` : ``}`} aria-label="기간 조회">
    <div className="date-range-control">
      <label><span>기간 선택</span><select value={value.preset} onChange={(event) => selectPreset(event.target.value)}>{options.map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></label>
      <div className="date-range-inputs">
        <label><span>시작일</span><input type="date" onClick={openNativeDatePicker} required value={value.start} max={value.end || undefined} onChange={(event) => onChange({ ...value, preset: `custom`, start: event.target.value })} /></label>
        <i aria-hidden="true">~</i>
        <label><span>종료일</span><input type="date" onClick={openNativeDatePicker} required value={value.end} min={value.start || undefined} onChange={(event) => onChange({ ...value, preset: `custom`, end: event.target.value })} /></label>
      </div>
    </div>
    {invalid && <p className="date-range-error">시작일과 종료일을 올바른 순서로 입력해주세요.</p>}
  </div>;
}

function p({ onGo: e }) {
  const [liveDashboard,setLiveDashboard]=r.useState({totals:{courses:0,learners:0,completed:0,progress:0,completionRate:0,requiredIncomplete:0,delayed:0},monthly:[]});
  const [dashboardState,setDashboardState]=r.useState({loading:true,error:false});
  const [range, setRange] = r.useState({ preset:`sixMonths`, ...adminQuickRange(`sixMonths`) });
  const validRange = Boolean(range.start && range.end && range.start <= range.end);
  const lastValidRange = r.useRef(range);
  if (validRange) lastValidRange.current = range;
  const effectiveRange = validRange ? range : lastValidRange.current;
  r.useEffect(()=>{
    let active=true;
    setDashboardState({loading:true,error:false});
    apiRequest(`/api/v1/admin/dashboard?start=${encodeURIComponent(effectiveRange.start)}&end=${encodeURIComponent(effectiveRange.end)}`)
      .then((result)=>{if(active){setLiveDashboard(result);setDashboardState({loading:false,error:false});}})
      .catch(()=>{if(active)setDashboardState({loading:false,error:true});});
    return ()=>{active=false;};
  },[effectiveRange.start,effectiveRange.end]);
  const data = (liveDashboard.monthly || []).filter((item) => item.key >= effectiveRange.start.slice(0,7) && item.key <= effectiveRange.end.slice(0,7));
  const average = (key) => data.length ? Math.round(data.reduce((sum, item) => sum + item[key], 0) / data.length) : 0;
  const totals = liveDashboard.totals;
  const [hovered, setHovered] = (0, r.useState)(null);

  const tasks = [
    {
      title: `학습 지연자`,
      count: totals.delayed || 0,
      detail: `진도율이 낮거나 최근 학습 기록이 없는 학습자`,
      tone: `delay`,
      page: `learners`,
    },
    {
      title: `필수교육 미완료`,
      count: totals.requiredIncomplete || 0,
      detail: `필수교육 수료 조건을 아직 충족하지 못한 학습자`,
      tone: `waiting`,
      page: `learners`,
    },
    {
      title: `리워드 확인`,
      count: 0,
      detail: `이번 달 학습 랭킹 상위 학습자`,
      tone: `survey`,
      page: `rewards`,
    },
  ];

  return (
    <>
      <section className="admin-period-section admin-period-toolbar" aria-label="대시보드 기간 필터">
        <DateRangeFilter value={range} onChange={setRange} />
      </section>
      <section
        className="admin-summary admin-home-kpis"
        aria-label="교육 운영 요약"
      >
        {[
          [`운영 교육과정`, `${totals.courses}개`, `${effectiveRange.start.replaceAll(`-`, `.`)} ~ ${effectiveRange.end.replaceAll(`-`, `.`)} 기준`],
          [`신규 수강 인원`, `${totals.learners}명`, `선택 기간 신규 신청·배정`],
          [`수료 인원`, `${totals.completed}명`, `선택 기간 수료 완료`],
          [`평균 진도율`, `${totals.progress}%`, `선택 기간 월평균`],
          [`평균 수료율`, `${totals.completionRate}%`, `선택 기간 월평균`],
        ].map(([label, value, note]) => (
          <div key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
            <small>{note}</small>
          </div>
        ))}
      </section>

      <section className="admin-insight-grid admin-home-insights">
        <article className="panel trend-panel admin-home-trend">
          <div className="panel-head admin-chart-head">
            <div>
              <h2>{formatAdminPeriod(effectiveRange)} 교육 현황</h2>
              {dashboardState.loading && <p className="admin-chart-empty-note">* 선택한 기간의 통계를 불러오는 중입니다.</p>}
              {dashboardState.error && <p className="admin-chart-empty-note error">* 통계를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.</p>}
              {!dashboardState.loading && !dashboardState.error && !data.some((item)=>item.completed||item.active||item.courses) && <p className="admin-chart-empty-note">* 선택한 기간에 조회할 통계가 없습니다.</p>}
            </div>
          </div>

          <div className="admin-chart-legend" aria-label="그래프 범례">
            <span className="completion-legend">수료 인원</span>
            <span className="active-legend">신청·수강 중</span>
            <span className="course-legend">수료 과정</span>
          </div>

          <div
            className="admin-progress-chart admin-monthly-bars"
            role="img"
            aria-label="최근 6개월 수료 인원과 신청 및 수강 중 인원을 비교한 막대그래프"
          >
            <div className="admin-chart-y-axis">
              {[120, 90, 60, 30, 0].map((value) => (
                <span key={value}>{value}명</span>
              ))}
            </div>
            <div className="admin-bar-canvas">
              <div className="admin-bar-grid" aria-hidden="true">{[0, 1, 2, 3, 4].map((line) => <i key={line} />)}</div>
              <div className="admin-bar-groups">
                {data.map((item, index) => <button key={item.key} type="button" className="admin-bar-group"
                  aria-label={`${item.month} 수료 인원 ${item.completed}명, 신청 및 수강 중 ${item.active}명, 수료 과정 ${item.courses}개`}
                  onMouseEnter={() => setHovered(index)} onMouseLeave={() => setHovered(null)} onFocus={() => setHovered(index)} onBlur={() => setHovered(null)}>
                  <span className="admin-bar-pair" aria-hidden="true">
                    <i className="completed-bar" style={{ height: `${item.completed / 1.2}%` }} />
                    <i className="active-bar" style={{ height: `${item.active / 1.2}%` }} />
                  </span>
                  <b>{item.month}</b>
                  <small>{item.courses}개 과정</small>
                  {hovered === index && <span className="admin-chart-tooltip">
                    <b>{item.month}</b>
                    <em><i className="completion-color" />수료 인원 <strong>{item.completed}명</strong></em>
                    <em><i className="active-color" />신청·수강 중 <strong>{item.active}명</strong></em>
                    <em><i className="course-color" />수료 과정 <strong>{item.courses}개</strong></em>
                  </span>}
                </button>)}
              </div>
            </div>
          </div>
        </article>

        <article className="panel attention-panel admin-home-attention">
          <div className="panel-head">
            <div>
              <h2>관리 필요 항목</h2>
              <p>확인이 필요한 관리 항목을 확인하세요.</p>
            </div>
          </div>
          <div className="admin-attention-list">
            {tasks.map((task) => (
              <button
                key={task.title}
                className={`task ${task.tone}`}
                onClick={() => e(task.page)}
              >
                <span>
                  <b>{task.title}</b>
                  <small>{task.detail}</small>
                </span>
                <strong>{task.count}명</strong>
                <em aria-hidden="true">→</em>
              </button>
            ))}
          </div>
        </article>
      </section>
    </>
  );
}
function m({ learner: e = !1 }) {
  return (0, i.jsxs)(`div`, {
    className: `filters`,
    children: [
      (0, i.jsxs)(`div`, {
        className: `search`,
        children: [
          (0, i.jsx)(Icon, { icon: Search01Icon }),
          (0, i.jsx)(`input`, {
            placeholder: e ? `이름 또는 사번 검색` : `과정명 검색`,
          }),
        ],
      }),
      (0, i.jsx)(`select`, {
        children: (0, i.jsx)(`option`, {
          children: e ? `전체 소속` : `전체 분야`,
        }),
      }),
      (0, i.jsx)(`select`, {
        children: (0, i.jsx)(`option`, {
          children: e ? `전체 직급` : `전체 상태`,
        }),
      }),
      (0, i.jsx)(`button`, { className: `secondary`, children: `검색` }),
      (0, i.jsx)(`button`, { className: `ghost`, children: `초기화` }),
    ],
  });
}
function h({ status: e }) {
  return (0, i.jsx)(u, {
    tone: e === `운영 중` ? `green` : e === `오픈 전` ? `blue` : `gray`,
    children: e,
  });
}
function g() {
  return (0, i.jsxs)(`div`, {
    className: `course-filters`,
    children: [
      (0, i.jsxs)(`div`, {
        className: `filter-title`,
        children: [
          (0, i.jsx)(`b`, { children: `교육과정 검색` }),
          (0, i.jsx)(`span`, {
            children: `원하는 조건을 선택한 후 검색해 주세요.`,
          }),
        ],
      }),
      (0, i.jsxs)(`div`, {
        className: `course-filter-fields`,
        children: [
          (0, i.jsxs)(`div`, {
            className: `search course-search`,
            children: [
              (0, i.jsx)(Icon, { icon: Search01Icon }),
              (0, i.jsx)(`input`, { placeholder: `과정명을 입력해 주세요` }),
            ],
          }),
          (0, i.jsxs)(`select`, {
            "aria-label": `분야`,
            children: [
              (0, i.jsx)(`option`, { children: `전체 분야` }),
              (0, i.jsx)(`option`, { children: `직무역량` }),
              (0, i.jsx)(`option`, { children: `리더십` }),
              (0, i.jsx)(`option`, { children: `AX` }),
              (0, i.jsx)(`option`, { children: `법정필수` }),
            ],
          }),
          (0, i.jsxs)(`select`, {
            "aria-label": `상태`,
            children: [
              (0, i.jsx)(`option`, { children: `전체 상태` }),
              (0, i.jsx)(`option`, { children: `오픈 전` }),
              (0, i.jsx)(`option`, { children: `운영 중` }),
              (0, i.jsx)(`option`, { children: `종료` }),
            ],
          }),
          (0, i.jsxs)(`select`, {
            "aria-label": `대상 부서`,
            children: [
              (0, i.jsx)(`option`, { children: `전체 부서` }),
              (0, i.jsx)(`option`, { children: `People팀` }),
              (0, i.jsx)(`option`, { children: `개발팀` }),
              (0, i.jsx)(`option`, { children: `마케팅팀` }),
              (0, i.jsx)(`option`, { children: `세일즈팀` }),
            ],
          }),
          (0, i.jsxs)(`select`, {
            "aria-label": `대상 직급`,
            children: [
              (0, i.jsx)(`option`, { children: `전체 직급` }),
              (0, i.jsx)(`option`, { children: `인턴` }),
              (0, i.jsx)(`option`, { children: `매니저` }),
              (0, i.jsx)(`option`, { children: `파트장` }),
              (0, i.jsx)(`option`, { children: `팀장` }),
            ],
          }),
          (0, i.jsxs)(`button`, {
            className: `course-search-button`,
            children: [
              (0, i.jsx)(Icon, { icon: Search01Icon }),
              (0, i.jsx)(`span`, { children: `검색` }),
            ],
          }),
          (0, i.jsx)(`button`, {
            className: `filter-reset`,
            children: `초기화`,
          }),
        ],
      }),
    ],
  });
}
function CourseAdminGrid({ onEdit, onCreate }) {
  const [query, setQuery] = r.useState(``);
  const [category, setCategory] = r.useState(`전체 분야`);
  const [level, setLevel] = r.useState(`전체 레벨`);
  const [status, setStatus] = r.useState(`전체 상태`);
  const [sort, setSort] = r.useState(`최신 등록순`);
  const [courses, setCourses] = r.useState([]);
  const [courseLoading, setCourseLoading] = r.useState(true);
  const [openMenu, setOpenMenu] = r.useState(null);
  const [deleteTarget, setDeleteTarget] = r.useState(null);
  const [tagSettings,setTagSettings]=r.useState([]);
  const [featuredTags,setFeaturedTags]=r.useState([]);
  const [tagPanelOpen,setTagPanelOpen]=r.useState(false);
  const [tagSaving,setTagSaving]=r.useState(false);
  const filtered = courses
    .filter(
      (course) =>
        (!query || course.title.includes(query)) &&
        (category === `전체 분야` || course.category === category) &&
        (level === `전체 레벨` || course.level === level) &&
        (status === `전체 상태` || course.status === status),
    )
    .sort((first, second) =>
      sort === `최신 등록순` ? second.id - first.id : first.id - second.id,
    );
  r.useEffect(() => { Promise.all([apiRequest(`/api/v1/courses`),apiRequest(`/api/v1/courses/tags/settings`)]).then(([items,tags])=>{setCourses(items.map((course) => ({ ...course, status: ({ DRAFT:`오픈 전`, OPEN:`운영 중`, CLOSED:`종료` })[course.status] || course.status, period: course.startDate && course.endDate ? `${String(course.startDate).slice(0,10).replaceAll(`-`,`.`)} ~ ${String(course.endDate).slice(0,10).replaceAll(`-`,`.`)}` : `기간 미설정` })));setTagSettings(tags);setFeaturedTags(tags.filter((tag)=>tag.featured).map((tag)=>tag.tag));}).catch(() => {}).finally(() => setCourseLoading(false)); }, []);
  const saveFeaturedTags=async()=>{setTagSaving(true);try{const saved=await apiRequest(`/api/v1/courses/tags/featured`,{method:`PUT`,body:JSON.stringify({tags:featuredTags})});setFeaturedTags(saved);showAdminToast(`학습자 빠른 선택 태그가 저장되었습니다.`);setTagPanelOpen(false);}catch{showAdminToast(`빠른 선택 태그를 저장하지 못했습니다.`,`error`);}finally{setTagSaving(false);}};
  const openCourse = async (course) => { try { const detail = await apiRequest(`/api/v1/courses/${course.id}`); onEdit({ ...course, ...detail, status: ({ DRAFT:`오픈 전`, OPEN:`운영 중`, CLOSED:`종료` })[detail.status] || detail.status, curriculum: detail.lessons }); } catch { showAdminToast(`교육과정을 불러오지 못했습니다.`, `error`); } };
  const deleteCourse = (course) => {
    setDeleteTarget(course);
  };
  const confirmDeleteCourse = async () => {
    try { await apiRequest(`/api/v1/courses/${deleteTarget.id}`, { method: `DELETE` }); } catch { return showAdminToast(`교육과정을 삭제하지 못했습니다.`, `error`); }
    setCourses((current) => current.filter((item) => item.id !== deleteTarget.id));
    setOpenMenu(null);
    setDeleteTarget(null);
    showAdminToast(`교육과정이 삭제되었습니다.`);
  };
  return (
    <section className="course-admin-grid-page">
      <SearchFilterPanel
        value={query}
        onValueChange={setQuery}
        placeholder="교육과정명, 키워드 검색"
        filters={[
          { label: `분야`, value: category, onChange: setCategory, options: [`전체 분야`, `직무역량`, `리더십`, `AX`, `법정필수`] },
          { label: `레벨`, value: level, onChange: setLevel, options: [`전체 레벨`, `레벨 1`, `레벨 2`, `레벨 3`] },
          { label: `상태`, value: status, onChange: setStatus, options: [`전체 상태`, `오픈 전`, `운영 중`, `종료`] },
        ]}
        onSearch={() => {}}
        onReset={() => {
            setQuery(``);
            setCategory(`전체 분야`);
            setLevel(`전체 레벨`);
            setStatus(`전체 상태`);
        }}
      />
      <div className="course-admin-result">
        <div>
          <span>전체 교육과정</span>
          <b>{filtered.length}개</b>
        </div>
        <div className="course-admin-result-actions">
          <select className="course-sort-select" aria-label="교육과정 정렬" value={sort} onChange={(event) => setSort(event.target.value)}>
            <option>최신 등록순</option><option>오래된 등록순</option>
          </select>
          <button type="button" className="secondary" onClick={()=>setTagPanelOpen((open)=>!open)}>빠른 선택 태그 관리</button>
          <button type="button" className="primary course-create-compact" onClick={onCreate}><Icon icon={Add01Icon} size={16} />새 교육과정 등록</button>
        </div>
      </div>
      {tagPanelOpen && <section className="admin-featured-tags-panel"><div><h3>빠른 선택 태그 관리</h3><p>과정에 등록된 해시태그 중 학습자 교육과정 조회 화면에 노출할 태그를 선택하세요. 최대 8개까지 노출됩니다.</p></div><div className="admin-featured-tag-list">{tagSettings.map((item)=><label className={featuredTags.includes(item.tag)?`selected`:``} key={item.tag}><input type="checkbox" checked={featuredTags.includes(item.tag)} disabled={!featuredTags.includes(item.tag)&&featuredTags.length>=8} onChange={()=>setFeaturedTags((current)=>current.includes(item.tag)?current.filter((tag)=>tag!==item.tag):[...current,item.tag])}/><span>#{item.tag}</span><small>{item.courseCount}개 과정</small></label>)}</div>{tagSettings.length===0&&<div className="admin-course-empty">과정에 등록된 해시태그가 없습니다.</div>}<div className="admin-featured-tag-actions"><button className="secondary" onClick={()=>setTagPanelOpen(false)}>취소</button><button className="primary" disabled={tagSaving} onClick={saveFeaturedTags}>{tagSaving?`저장 중...`:`노출 설정 저장`}</button></div></section>}
      <div className="admin-course-card-grid">
        {filtered.map((course, index) => (
          <article
            className="course-card toss-card admin-course-management-card"
            key={course.id}
            role="button"
            tabIndex={0}
            onClick={() => openCourse(course)}
            onKeyDown={(event) => {
              if (event.key === `Enter` || event.key === ` `) openCourse(course);
            }}
          >
            <div className="visual-wrap admin-course-visual">
              {course.thumbnail ? (
                <img className="admin-course-thumbnail" src={course.thumbnail} alt={`${course.title} 썸네일`} />
              ) : (
                <J accent={[`blue`, `green`, `purple`, `red`][index % 4]} label={course.category} />
              )}
              <span
                className={`admin-course-status ${course.status === `운영 중` ? `running` : course.status === `오픈 전` ? `ready` : `closed`}`}
              >
                {course.status}
              </span>
              <div className="admin-course-menu-wrap">
                <button
                  type="button"
                  className="admin-course-more"
                  aria-label={`${course.title} 관리 메뉴`}
                  aria-expanded={openMenu === course.id}
                  onClick={(event) => {
                    event.stopPropagation();
                    setOpenMenu(openMenu === course.id ? null : course.id);
                  }}
                >
                  ⋯
                </button>
                {openMenu === course.id && (
                  <div className="admin-course-menu">
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        setOpenMenu(null);
                        openCourse(course);
                      }}
                    >
                      <Icon icon={Edit02Icon} size={15} /> 수정
                    </button>
                    <button
                      type="button"
                      className="delete"
                      onClick={(event) => {
                        event.stopPropagation();
                        deleteCourse(course);
                      }}
                    >
                      <Icon icon={Delete02Icon} size={15} /> 삭제
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="course-card-body">
              <div className="course-labels">
                <span className="category-text">{course.category}</span>
              </div>
              <h2>{course.title}</h2>
              <div className="admin-course-period">{course.period}</div>
              <div className="admin-course-metrics">
                <span>수강 {course.learners}명</span>
                <i aria-hidden="true" />
                <span>수료율 {course.rate}%</span>
                <i aria-hidden="true" />
                <span className="admin-course-like"><Icon icon={ThumbsUpIcon} size={15} />{course.likes ?? ([74, 87, 98, 64, 53, 126][course.id - 1] || 42)}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="admin-course-empty">
          조건에 맞는 교육과정이 없습니다.
        </div>
      )}
      {courseLoading && <div className="admin-course-empty">실제 교육과정 데이터를 불러오는 중입니다.</div>}
      {deleteTarget && <ConfirmModal title="교육과정을 삭제할까요?" description="삭제한 교육과정은 복구할 수 없습니다." confirmLabel="삭제" onCancel={() => setDeleteTarget(null)} onConfirm={confirmDeleteCourse} />}
    </section>
  );
}

function youtubeEmbedUrl(url) {
  if (!url) return ``;
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([^?&/]+)/,
  );
  return match
    ? `https://www.youtube-nocookie.com/embed/${match[1]}?rel=0`
    : ``;
}

const SAMPLE_GOOGLE_FORM_URL = `https://docs.google.com/forms/d/11K1ewTmlScyH4ZNLWQ1uvHgePPCyU_Ls9aQglbAc144/edit?hl=ko`;
function googleFormId(url = ``) {
  const match = url.trim().match(/docs\.google\.com\/forms\/d\/(?:e\/)?([a-zA-Z0-9_-]+)/);
  return match?.[1] || ``;
}
function googleFormEmbedUrl(url = ``) {
  const inputUrl = url.trim();
  if (/^https:\/\/docs\.google\.com\/forms\/d\/e\/[a-zA-Z0-9_-]+\/viewform(?:[?#]|$)/.test(inputUrl)) {
    if (/[?&]embedded=true(?:&|#|$)/.test(inputUrl)) return inputUrl;
    const [urlWithoutHash, hash = ``] = inputUrl.split(`#`, 2);
    return `${urlWithoutHash}${urlWithoutHash.includes(`?`) ? `&` : `?`}embedded=true${hash ? `#${hash}` : ``}`;
  }
  const id = googleFormId(inputUrl);
  return id ? `https://docs.google.com/forms/d/${id}/viewform?embedded=true` : ``;
}
function googleFormResultsUrl(url = ``) {
  const inputUrl = url.trim();
  if (/\/forms\/d\/[a-zA-Z0-9_-]+\/edit/.test(inputUrl)) {
    return inputUrl.split(`#`)[0].split(`?`)[0] + `#responses`;
  }
  return `https://docs.google.com/forms/u/0/?tgif=d`;
}

const createDefaultSurveyQuestions = () => [
  {
    id: 1,
    question: `교육 내용이 실무에 도움이 되었나요?`,
    type: `5점 척도`,
    required: true,
    lowLabel: `매우 그렇지 않다`,
    highLabel: `매우 그렇다`,
    options: [],
  },
  {
    id: 2,
    question: `가장 도움이 된 교육 요소를 선택해 주세요.`,
    type: `단일 선택`,
    required: true,
    options: [`실무 사례`, `강의 설명`, `실습`, `교육 자료`],
  },
  {
    id: 3,
    question: `앞으로 더 다뤘으면 하는 내용을 선택해 주세요.`,
    type: `복수 선택`,
    required: false,
    options: [`실무 사례`, `심화 이론`, `실습`, `Q&A`],
  },
  {
    id: 4,
    question: `교육에서 좋았던 점이나 개선 의견을 작성해 주세요.`,
    type: `주관식`,
    required: false,
    options: [],
  },
];

const LMS_ASSIGNMENT_DEPARTMENTS = [`People팀`, `개발팀`, `마케팅팀`, `운영팀`, `세일즈팀`, `공간디자인팀`];
const LMS_ASSIGNMENT_POSITIONS = [`인턴`, `사원`, `매니저`, `파트장`, `팀장`];
const LMS_ASSIGNMENT_NAMES = [`김수민`, `이지은`, `박서준`, `최하늘`, `정유진`, `김도윤`, `윤서아`, `오지훈`, `한가람`, `서민재`, `조하은`, `송현우`, `강지수`, `백승민`, `임채원`, `문태영`, `장예린`, `고은호`, `유다인`, `신재욱`, `배서윤`, `노준호`, `홍예진`, `안도현`];
const defaultAssignmentLearners = () => LMS_ASSIGNMENT_NAMES.map((name, index) => ({
  id: `SP${String(1024 + index).padStart(4, `0`)}`,
  name,
  dept: LMS_ASSIGNMENT_DEPARTMENTS[index % LMS_ASSIGNMENT_DEPARTMENTS.length],
  position: [`인턴`, `매니저`, `팀장`, `파트장`][index % 4],
}));
function getAssignmentLearners() {
  try {
    const managed = JSON.parse(localStorage.getItem(`sparkplus-managed-learners`));
    return Array.isArray(managed) && managed.length ? managed : defaultAssignmentLearners();
  } catch {
    return defaultAssignmentLearners();
  }
}
function getCourseAssignments() {
  try {
    return Object.keys(localStorage)
      .filter((key) => key.startsWith(`sparkplus-course-assignment-`))
      .map((key) => JSON.parse(localStorage.getItem(key)))
      .filter(Boolean);
  } catch {
    return [];
  }
}
function getCourseConfig(courseId) {
  try { return JSON.parse(localStorage.getItem(`sparkplus-course-config-${courseId}`)) || {}; } catch { return {}; }
}
function assignmentAppliesToUser(assignment, user) {
  const modes = assignment?.modes || [];
  return modes.includes(`all`) ||
    (modes.includes(`department`) && assignment.departments?.includes(user.department)) ||
    (modes.includes(`position`) && assignment.positions?.includes(user.position)) ||
    (modes.includes(`individual`) && assignment.learnerIds?.includes(user.id));
}
function applyManagedCourseAssignments(courses, user) {
  const assignments = getCourseAssignments().filter((assignment) => assignmentAppliesToUser(assignment, user));
  return courses.map((course) => {
    const config = getCourseConfig(course.id);
    const assignment = assignments.find((item) => Number(item.userCourseId) === Number(course.id));
    if (!assignment) return { ...course, ...config };
    return { ...course, ...config, enrolled: true, progress: course.progress ?? 0, managedAssignment: true, requiredTraining: Boolean(assignment.required), assignmentDeadline: assignment.deadline || `` };
  });
}
function isManagedUserInactive(user) {
  return getAssignmentLearners().some((learner) => learner.id === user.id && learner.status === `비활성`);
}

function CourseEditorV2({ selected, onBack, isNew = false }) {
  const defaultDates = {
    1: [`2026-08-01`, `2026-09-30`],
    2: [`2026-08-18`, `2026-10-10`],
    3: [`2026-09-01`, `2026-11-30`],
    4: [`2026-03-01`, `2026-06-30`],
  };
  const baseLessons = [
    {
      title: `교육 소개 및 학습 안내`,
      description: `과정의 목표와 전체 학습 흐름을 확인합니다.`,
      duration: `18분`,
      videoUrl:
        selected.id === 3
          ? `https://youtu.be/P8pEFQBXbKI?si=QXqrVhzXOuFvw1_s`
          : ``,
      goals: `과정의 핵심 목표와 학습 순서를 이해할 수 있습니다.`,
      contents: `과정 소개\n학습 방법과 수료 흐름\n업무 적용 포인트`,
      attachments: `오리엔테이션 자료.pdf`,
      quizEnabled: true,
      quiz: [
        {
          question: `이번 차시의 핵심 학습 목표는 무엇인가요?`,
          type: `객관식`,
          answer: `목표와 학습 흐름 이해`,
        },
      ],
    },
    {
      title: `핵심 개념 이해`,
      description: `업무에 필요한 핵심 개념과 기본 원리를 학습합니다.`,
      duration: `24분`,
      videoUrl: ``,
      goals: `핵심 개념을 설명하고 업무 사례에 연결할 수 있습니다.`,
      contents: `핵심 용어\n기본 원칙\n실무 판단 기준`,
      attachments: `핵심 개념 요약.pdf`,
      quizEnabled: true,
      quiz: [
        {
          question: `핵심 원칙으로 올바른 것은 무엇인가요?`,
          type: `객관식`,
          answer: `상황과 목표를 먼저 확인한다`,
        },
      ],
    },
    {
      title: `실무 사례 분석`,
      description: `실제 업무 사례를 통해 적용 방법을 살펴봅니다.`,
      duration: `22분`,
      videoUrl: ``,
      goals: `사례의 문제를 분석하고 적절한 해결 방법을 선택할 수 있습니다.`,
      contents: `업무 사례\n문제 분석\n해결안 비교`,
      attachments: `사례 실습지.xlsx`,
      quizEnabled: false,
      quiz: [],
    },
    {
      title: `업무 적용 실습`,
      description: `학습 내용을 자신의 업무 상황에 직접 적용합니다.`,
      duration: `20분`,
      videoUrl: ``,
      goals: `학습 내용을 자신의 업무에 적용할 수 있습니다.`,
      contents: `적용 단계\n실습\n자가 점검`,
      attachments: `업무 적용 템플릿.docx`,
      quizEnabled: false,
      quiz: [],
    },
    {
      title: `최종 점검`,
      description: `핵심 내용을 복습하고 학습을 마무리합니다.`,
      duration: `15분`,
      videoUrl: ``,
      goals: `과정 전체의 핵심 내용을 정리할 수 있습니다.`,
      contents: `핵심 요약\n최종 점검\n다음 학습 안내`,
      attachments: `최종 요약.pdf`,
      quizEnabled: true,
      quiz: [
        {
          question: `과정에서 가장 중요하게 다룬 내용은 무엇인가요?`,
          type: `주관식`,
          answer: `핵심 개념의 실무 적용`,
        },
      ],
    },
  ].slice(0, selected.lessons || 5);
  const savedAssignments = Array.isArray(selected.assignments) ? selected.assignments : [];
  const assignmentModes = [...new Set(savedAssignments.map((item) => ({ ALL:`all`, ORGANIZATION:`department`, POSITION:`position`, USER:`individual` })[item.type]).filter(Boolean))];
  const assignmentTargets = (type) => savedAssignments.filter((item) => item.type === type).map((item) => item.targetId).filter(Boolean);
  const [form, setForm] = r.useState({
    title: isNew ? `` : selected.title,
    category: isNew ? `` : selected.category,
    status: isNew ? `` : selected.status,
    level: isNew ? `` : selected.level || `레벨 2`,
    department: isNew ? `` : `전체 부서`,
    position: isNew ? `` : `전체 직급`,
    startDate: isNew ? `` : String(selected.startDate || defaultDates[selected.id]?.[0] || `2026-08-01`).slice(0,10),
    endDate: isNew ? `` : String(selected.endDate || defaultDates[selected.id]?.[1] || `2026-09-30`).slice(0,10),
    thumbnail: selected.thumbnail || ``,
    introduction: isNew ? `` : selected.description || `${selected.title} 과정의 핵심 개념을 이해하고 실제 업무에 활용할 수 있도록 구성된 교육과정입니다.`,
    curriculumSummary: isNew ? `` : selected.curriculumSummary || `기초 개념부터 실무 적용까지 단계적으로 학습합니다.`,
    tags: isNew ? [] : selected.tags || [],
    lessons: isNew ? [] : selected.curriculum || baseLessons,
    surveyEnabled: isNew ? false : selected.surveyEnabled ?? true,
    googleFormUrl: isNew ? `` : selected.googleFormUrl || SAMPLE_GOOGLE_FORM_URL,
    surveyTitle: isNew ? `` : `${selected.title} 만족도 조사`,
    surveyStartDate: isNew ? `` : `2026-08-01`,
    surveyEndDate: isNew ? `` : `2026-08-10`,
    surveyDescription: isNew ? `` : `교육 내용과 운영에 대한 의견을 들려주세요. 응답 내용은 향후 교육 개선에 활용됩니다.`,
    surveyAnonymous: true,
    surveyQuestions: isNew ? [] : selected.surveyQuestions || createDefaultSurveyQuestions(),
    assignmentModes,
    assignedDepartments: assignmentTargets(`ORGANIZATION`),
    assignedPositions: assignmentTargets(`POSITION`),
    assignedLearnerIds: assignmentTargets(`USER`),
    requiredTraining: savedAssignments.some((item) => item.required),
    assignmentDeadlineEnabled: savedAssignments.some((item) => item.dueDate),
    assignmentDeadline: savedAssignments.find((item) => item.dueDate)?.dueDate?.slice(0,10) || ``,
  });
  const [tagInput,setTagInput]=r.useState((isNew?[]:selected.tags||[]).map((tag)=>`#${tag}`).join(`, `));
  const [editingIndex, setEditingIndex] = r.useState(null);
  const [activeSection, setActiveSection] = r.useState(`basic`);
  const [dirty, setDirty] = r.useState(false);
  const [coursePreview, setCoursePreview] = r.useState(false);
  const [draggingLesson, setDraggingLesson] = r.useState(null);
  const [assignmentSearch, setAssignmentSearch] = r.useState(``);
  const [assignmentListOpen, setAssignmentListOpen] = r.useState(false);
  const [lessonDeleteIndex, setLessonDeleteIndex] = r.useState(null);
  const [courseDeleteOpen, setCourseDeleteOpen] = r.useState(false);
  const [generatingQuiz, setGeneratingQuiz] = r.useState(false);
  const [assignmentLearners,setAssignmentLearners]=r.useState([]);
  r.useEffect(()=>{apiRequest(`/api/v1/admin/management`).then((data)=>setAssignmentLearners((data.users||[]).filter((user)=>user.status===`ACTIVE`).map((user)=>({id:user.id,employeeNumber:user.employeeNumber,name:user.name,dept:user.organizationName||`소속 미지정`,position:user.position||`직책 미지정`})))).catch(()=>setAssignmentLearners([]));},[]);
  const assignmentDepartments=r.useMemo(()=>[...new Set(assignmentLearners.map((learner)=>learner.dept).filter((value)=>value&&value!==`소속 미지정`))],[assignmentLearners]);
  const assignmentPositions=r.useMemo(()=>[...new Set(assignmentLearners.map((learner)=>learner.position).filter((value)=>value&&value!==`직책 미지정`))],[assignmentLearners]);
  const formMounted = r.useRef(false);
  const sectionRefs = { basic: r.useRef(null), lessons: r.useRef(null), survey: r.useRef(null) };
  r.useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible?.target?.dataset?.section) setActiveSection(visible.target.dataset.section);
    }, { rootMargin: `-180px 0px -55%`, threshold: [0, .15, .4] });
    Object.values(sectionRefs).forEach((ref) => ref.current && observer.observe(ref.current));
    return () => observer.disconnect();
  }, []);
  r.useEffect(() => {
    if (!formMounted.current) { formMounted.current = true; return; }
    setDirty(true);
  }, [form]);
  const update = (key, value) =>
    (setDirty(true), setForm((current) => ({ ...current, [key]: value })));
  const updateLesson = (key, value) =>
    (setDirty(true), setForm((current) => ({
      ...current,
      lessons: current.lessons.map((lesson, index) =>
        index === editingIndex ? { ...lesson, [key]: value } : lesson,
      ),
    })));
  const lesson = editingIndex === null ? null : form.lessons[editingIndex];
  const toggleAssignmentMode = (mode) => update(`assignmentModes`, form.assignmentModes.includes(mode) ? form.assignmentModes.filter((item) => item !== mode) : [...form.assignmentModes, mode]);
  const toggleAssignmentValue = (key, value) => update(key, form[key].includes(value) ? form[key].filter((item) => item !== value) : [...form[key], value]);
  const assignedLearners = r.useMemo(() => {
    if (form.assignmentModes.includes(`all`)) return assignmentLearners;
    return assignmentLearners.filter((learner) =>
      (form.assignmentModes.includes(`department`) && form.assignedDepartments.includes(learner.dept)) ||
      (form.assignmentModes.includes(`position`) && form.assignedPositions.includes(learner.position)) ||
      (form.assignmentModes.includes(`individual`) && form.assignedLearnerIds.includes(learner.id)),
    );
  }, [form.assignmentModes, form.assignedDepartments, form.assignedPositions, form.assignedLearnerIds, assignmentLearners]);
  const filteredAssignmentLearners = assignmentLearners.filter((learner) => {
    const keyword = assignmentSearch.trim().toLowerCase();
    return !keyword || learner.name.toLowerCase().includes(keyword) || learner.employeeNumber.toLowerCase().includes(keyword);
  });
  const addLesson = () => {
    setForm((current) => ({
      ...current,
      lessons: [
        ...current.lessons,
        {
          title: ``,
          description: ``,
          duration: ``,
          videoUrl: ``,
          goals: ``,
          contents: ``,
          attachments: ``,
          quizEnabled: false,
          quiz: [],
        },
      ],
    }));
    setEditingIndex(form.lessons.length);
  };
  const addQuiz = () =>
    updateLesson(`quiz`, [{ question: ``, type: `객관식`, options: [``, ``, ``, ``], correctOption: 0, explanation: `` }]);
  const generateAiQuiz = async () => {
    if (!lesson?.videoUrl?.trim()) return showAdminToast(`먼저 공개 YouTube 영상 링크를 입력해 주세요.`, `error`);
    if ((lesson.quiz || []).some((item) => item.question?.trim()) && !window.confirm(`기존 퀴즈를 AI가 만든 1문항으로 교체할까요?`)) return;
    setGeneratingQuiz(true);
    try {
      const generated = await apiRequest(`/api/v1/courses/ai/quiz`, { method:`POST`, body:JSON.stringify({ youtubeUrl:lesson.videoUrl.trim(), lessonTitle:lesson.title }) });
      setDirty(true);
      setForm((current) => ({ ...current, lessons:current.lessons.map((item,index) => index === editingIndex ? { ...item, quizEnabled:true, quiz:[{ ...generated, type:`객관식`, answer:generated.options[generated.correctOption] }] } : item) }));
      showAdminToast(`영상 분석이 완료됐습니다. 문제와 정답을 검토한 뒤 과정을 저장해 주세요.`);
    } catch (error) {
      const messages = { INVALID_YOUTUBE_URL:`공개 YouTube 영상 주소를 확인해 주세요.`, GEMINI_NOT_CONFIGURED:`Gemini API 연결 설정이 아직 배포되지 않았습니다.`, GEMINI_GENERATION_FAILED:`영상을 분석하지 못했습니다. 공개 영상인지 확인한 뒤 다시 시도해 주세요.` };
      showAdminToast(messages[error.message] || `AI 퀴즈 생성에 실패했습니다. 잠시 후 다시 시도해 주세요.`, `error`);
    } finally { setGeneratingQuiz(false); }
  };
  const updateQuiz = (index, key, value) =>
    updateLesson(
      `quiz`,
      lesson.quiz.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [key]: value } : item,
      ),
    );
  const removeLesson = (index) => {
    setForm((current) => ({ ...current, lessons: current.lessons.filter((_, lessonIndex) => lessonIndex !== index) }));
    if (editingIndex === index) setEditingIndex(null);
    setDirty(true);
    setLessonDeleteIndex(null);
    showAdminToast(`차시가 삭제되었습니다.`);
  };
  const updateQuizOption = (questionIndex, optionIndex, value) => {
    const question = lesson.quiz[questionIndex];
    const options = [...(question.options || [])];
    const correctOption = Number.isInteger(question.correctOption) ? question.correctOption : Math.max(0, options.indexOf(question.answer));
    options[optionIndex] = value;
    updateLesson(`quiz`, lesson.quiz.map((item, index) => index === questionIndex ? { ...item, options, correctOption, answer: correctOption === optionIndex ? value : item.answer } : item));
  };
  const removeQuizOption = (questionIndex, optionIndex) => {
    const question = lesson.quiz[questionIndex];
    const options = question.options || [];
    if (options.length <= 2) return alert(`선택지는 최소 2개 이상이어야 합니다.`);
    const currentCorrect = Number.isInteger(question.correctOption) ? question.correctOption : Math.max(0, options.indexOf(question.answer));
    updateLesson(`quiz`, lesson.quiz.map((item, index) => index === questionIndex ? {
      ...item,
      options: options.filter((_, index) => index !== optionIndex),
      correctOption: currentCorrect === optionIndex ? 0 : currentCorrect > optionIndex ? currentCorrect - 1 : currentCorrect,
    } : item));
  };
  const updateSurveyQuestion = (index, key, value) =>
    setForm((current) => ({
      ...current,
      surveyQuestions: current.surveyQuestions.map((question, itemIndex) =>
        itemIndex === index ? { ...question, [key]: value } : question,
      ),
    }));
  const addSurveyQuestion = (type = `5점 척도`) =>
    setForm((current) => ({
      ...current,
      surveyQuestions: [
        ...current.surveyQuestions,
        {
          id: Date.now(),
          question: ``,
          type,
          required: false,
          lowLabel: ``,
          highLabel: ``,
          options: [`단일 선택`, `복수 선택`].includes(type) ? [``] : [],
        },
      ],
    }));
  const duplicateSurveyQuestion = (index) =>
    setForm((current) => {
      const copy = { ...current.surveyQuestions[index], id: Date.now(), options: [...(current.surveyQuestions[index].options || [])] };
      const surveyQuestions = [...current.surveyQuestions];
      surveyQuestions.splice(index + 1, 0, copy);
      return { ...current, surveyQuestions };
    });
  const removeSurveyQuestion = (index) =>
    setForm((current) => ({
      ...current,
      surveyQuestions: current.surveyQuestions.filter(
        (_, itemIndex) => itemIndex !== index,
      ),
    }));
  const moveSurveyQuestion = (index, direction) => {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= form.surveyQuestions.length) return;
    setForm((current) => {
      const surveyQuestions = [...current.surveyQuestions];
      [surveyQuestions[index], surveyQuestions[nextIndex]] = [
        surveyQuestions[nextIndex],
        surveyQuestions[index],
      ];
      return { ...current, surveyQuestions };
    });
  };
  const save = async () => {
    if (!form.title.trim() || !form.category) return alert(`강의 제목과 분야를 입력해 주세요.`);
    const assignments = [
      ...(form.assignmentModes.includes(`all`) ? [{ type:`ALL`, targetId:null }] : []),
      ...(form.assignmentModes.includes(`department`) ? form.assignedDepartments.map((targetId) => ({ type:`ORGANIZATION`, targetId })) : []),
      ...(form.assignmentModes.includes(`position`) ? form.assignedPositions.map((targetId) => ({ type:`POSITION`, targetId })) : []),
      ...(form.assignmentModes.includes(`individual`) ? form.assignedLearnerIds.map((targetId) => ({ type:`USER`, targetId })) : []),
    ].map((item) => ({ ...item, required:form.requiredTraining, dueDate:form.assignmentDeadlineEnabled ? form.assignmentDeadline : null }));
    const payload = {
      title:form.title, category:form.category, level:form.level || `레벨 1`, status:({ '오픈 전':`DRAFT`, '운영 중':`OPEN`, '종료':`CLOSED` })[form.status] || `DRAFT`,
      description:form.introduction, curriculumSummary:form.curriculumSummary, thumbnail:form.thumbnail || null, startDate:form.startDate || null, endDate:form.endDate || null,
      surveyEnabled:form.surveyEnabled, googleFormUrl:form.googleFormUrl || null, completionThreshold:60,
      tags:[...new Set(tagInput.split(/[,\s]+/).map((tag)=>tag.replace(/^#+/,``).trim()).filter(Boolean))].slice(0,12),
      lessons:form.lessons.map((item) => ({ id:item.id, title:item.title, description:item.description || ``, durationMinutes:parseInt(item.duration,10)||item.durationMinutes||0,
        videoType:item.videoType || `YOUTUBE`, videoUrl:item.videoUrl || null, driveFileId:item.driveFileId || null, attachmentName:item.attachments || item.attachmentName || null,
        attachmentDriveFileId:item.attachmentDriveFileId || null, goals:item.goals || ``, contents:item.contents || ``, completionThreshold:item.videoType === `DRIVE` ? 90 : 60,
        quiz:(item.quizEnabled ? item.quiz : []).slice(0,1).map((question) => { const options=[...(question.options || [])]; while(options.length<4) options.push(`선택지 ${options.length+1}`); return { id:question.id, question:question.question, options:options.slice(0,4), correctOption:Math.min(3,Number.isInteger(question.correctOption) ? question.correctOption : 0), explanation:question.explanation || `` }; }) })), assignments,
    };
    try {
      const saved=await apiRequest(isNew ? `/api/v1/courses` : `/api/v1/courses/${selected.id}`, { method:isNew ? `POST` : `PUT`, body:JSON.stringify(payload) });
      Object.assign(selected,saved); setDirty(false); showAdminToast(isNew ? `교육과정과 배정 대상이 등록되었습니다.` : `교육과정과 배정 정보가 저장되었습니다.`); if(isNew) onBack();
    } catch(requestError) { showAdminToast(requestError.message === `VALIDATION_ERROR` ? `필수 정보와 퀴즈 선택지를 확인해주세요.` : `교육과정을 저장하지 못했습니다.`, `error`); }
  };
  const remove = () => {
    setCourseDeleteOpen(true);
  };
  return (
    <div className="course-editor-v2">
      <div className="breadcrumb admin-detail-breadcrumb"><button onClick={onBack}>홈</button><span>›</span><button onClick={onBack}>교육과정 관리</button><span>›</span>{isNew ? `새 교육과정 등록` : `교육과정 수정`}</div>
      <button className="department-back" onClick={onBack}>
        <Icon icon={ArrowLeft01Icon} />
        교육과정 목록으로
      </button>
      <section className="course-editor-v2-hero course-builder-header">
        <div className="course-editor-v2-thumb">
          {form.thumbnail ? (
            <img src={form.thumbnail} alt="강의 썸네일" />
          ) : (
            <>
              <Icon icon={BookOpen01Icon} size={34} />
              <span>강의 썸네일</span>
            </>
          )}
          <label>
            이미지 변경
            <input
              type="file"
              accept="image/*"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = () => update(`thumbnail`, reader.result);
                  reader.readAsDataURL(file);
                }
              }}
            />
          </label>
        </div>
        <div>
          <span>{isNew ? `새 교육과정 등록` : `교육과정 수정`}</span>
          <h2>{form.title || `과정명을 입력해 주세요`}</h2>
          <p>{[form.category || `분야 미선택`, form.level || `레벨 미선택`, form.status || `상태 미선택`].join(` · `)}</p>
        </div>
        <div className="course-builder-header-actions"><button className="secondary course-preview-button" onClick={() => setCoursePreview(true)}><Icon icon={ViewIcon} />미리보기</button>{!isNew && <button className="course-delete-icon" title="과정 삭제" aria-label="과정 삭제" onClick={remove}><Icon icon={Delete02Icon} /></button>}</div>
      </section>
      <nav className="course-builder-nav">{[[`basic`, `01 기본 정보`], [`lessons`, `02 커리큘럼 및 차시`], [`survey`, `03 수료 후 설문`]].map(([key, label]) => <button key={key} className={activeSection === key ? `active` : ``} onClick={() => sectionRefs[key].current?.scrollIntoView({ behavior: `smooth`, block: `start` })}>{label}</button>)}</nav>
      {!isNew && (
        <section className="course-completion-summary" aria-label="교육과정 수료 현황">
          <div><span>전체 학습자</span><b>{selected.learners || 0}명</b></div>
          <div><span>수료</span><b>{Math.round((selected.learners || 0) * (selected.rate || 0) / 100)}명</b></div>
          <div><span>학습 중</span><b>{Math.max(0, (selected.learners || 0) - Math.round((selected.learners || 0) * (selected.rate || 0) / 100))}명</b></div>
          <div><span>수료율</span><b>{selected.rate || 0}%</b></div>
        </section>
      )}
      <section ref={sectionRefs.basic} data-section="basic" id="course-basic-section" className="panel editor-section course-builder-section">
        <div className="editor-section-head">
          <div>
            <span>01</span>
            <div><h3>과정 기본 정보</h3></div>
          </div>
        </div>
        <div className="course-edit-grid">
          <label className="wide">
            강의 제목
            <input
              value={form.title}
              placeholder="강의 제목을 입력해주세요"
              onChange={(event) => update(`title`, event.target.value)}
            />
          </label>
          <label>
            분야
            <select
              value={form.category}
              onChange={(event) => update(`category`, event.target.value)}
            >
              <option value="" disabled>분야를 선택해주세요</option>
              {[`직무역량`, `리더십`, `AX`, `법정필수`].map((value) => (
                <option key={value}>{value}</option>
              ))}
            </select>
          </label>
          <label>
            레벨
            <select
              value={form.level}
              onChange={(event) => update(`level`, event.target.value)}
            >
              <option value="" disabled>레벨을 선택해주세요</option>
              {[`레벨 1`, `레벨 2`, `레벨 3`].map((value) => (
                <option key={value}>{value}</option>
              ))}
            </select>
          </label>
          <label>
            상태
            <select
              value={form.status}
              onChange={(event) => update(`status`, event.target.value)}
            >
              <option value="" disabled>상태를 선택해주세요</option>
              {[`오픈 전`, `운영 중`, `종료`].map((value) => (
                <option key={value}>{value}</option>
              ))}
            </select>
          </label>
          <label>
            대상 부서
            <select
              value={form.department}
              onChange={(event) => update(`department`, event.target.value)}
            >
              <option value="" disabled>대상 부서를 선택해주세요</option>
              {[
                `전체 부서`,
                `People팀`,
                `개발팀`,
                `마케팅팀`,
                `세일즈팀`,
                `운영팀`,
              ].map((value) => (
                <option key={value}>{value}</option>
              ))}
            </select>
          </label>
          <label>
            대상 직급
            <select
              value={form.position}
              onChange={(event) => update(`position`, event.target.value)}
            >
              <option value="" disabled>대상 직급을 선택해주세요</option>
              {[`전체 직급`, `인턴`, `매니저`, `파트장`, `팀장`].map(
                (value) => (
                  <option key={value}>{value}</option>
                ),
              )}
            </select>
          </label>
          <div className="course-date-range wide">
            <label>
              교육 시작일
              <input
                type="date"
                onClick={openNativeDatePicker}
                value={form.startDate}
                onChange={(event) => update(`startDate`, event.target.value)}
              />
            </label>
            <span>–</span>
            <label>
              교육 종료일
              <input
                type="date"
                onClick={openNativeDatePicker}
                value={form.endDate}
                min={form.startDate}
                onChange={(event) => update(`endDate`, event.target.value)}
              />
            </label>
          </div>
          <label className="wide">
            강의 소개
            <textarea
              rows="5"
              value={form.introduction}
              placeholder="교육과정에 대한 소개를 입력해주세요."
              onChange={(event) => update(`introduction`, event.target.value)}
            />
          </label>
          <label className="wide course-tag-field">
            해시태그
            <input value={tagInput} placeholder="#신입사원, #리더십, #AI" onChange={(event)=>{setTagInput(event.target.value);setDirty(true);}}/>
            <small>쉼표 또는 띄어쓰기로 구분해 최대 12개까지 입력할 수 있습니다. 노출 여부는 교육과정 목록의 ‘빠른 선택 태그 관리’에서 설정합니다.</small>
          </label>
        </div>
        <div className="course-assignment-section">
          <div className="course-assignment-heading">
            <div><span>교육 대상</span><h3>학습자를 과정에 배정합니다</h3><p>전체·부서·직급·개별 학습자를 함께 선택할 수 있습니다.</p></div>
            <div className="course-assignment-count"><span>배정 인원</span><b>{assignedLearners.length}명</b><button type="button" disabled={!assignedLearners.length} onClick={() => setAssignmentListOpen(true)}>배정 대상 보기</button></div>
          </div>
          <div className="assignment-method-grid">
            {[[`all`,`전체 학습자`,`등록된 모든 학습자`],[`department`,`부서별`,`선택한 부서 전체`],[`position`,`직급별`,`선택한 직급 전체`],[`individual`,`개별 학습자`,`이름·사번으로 선택`]].map(([value,label,description]) => <label className={form.assignmentModes.includes(value) ? `selected` : ``} key={value}><input type="checkbox" checked={form.assignmentModes.includes(value)} onChange={() => toggleAssignmentMode(value)} /><span><b>{label}</b><small>{description}</small></span></label>)}
          </div>
          {form.assignmentModes.includes(`department`) && <div className="assignment-option-block"><h4>부서 선택</h4><div className="assignment-chip-list">{assignmentDepartments.map((value) => <button type="button" className={form.assignedDepartments.includes(value) ? `selected` : ``} onClick={() => toggleAssignmentValue(`assignedDepartments`, value)} key={value}>{form.assignedDepartments.includes(value) && <Icon icon={CheckmarkCircle02Icon} size={14} />}{value}</button>)}</div></div>}
          {form.assignmentModes.includes(`position`) && <div className="assignment-option-block"><h4>직급 선택</h4><div className="assignment-chip-list">{assignmentPositions.map((value) => <button type="button" className={form.assignedPositions.includes(value) ? `selected` : ``} onClick={() => toggleAssignmentValue(`assignedPositions`, value)} key={value}>{form.assignedPositions.includes(value) && <Icon icon={CheckmarkCircle02Icon} size={14} />}{value}</button>)}</div></div>}
          {form.assignmentModes.includes(`individual`) && <div className="assignment-option-block assignment-individual-block"><h4>개별 학습자 선택</h4><label className="assignment-learner-search"><Icon icon={Search01Icon} size={17} /><input value={assignmentSearch} onChange={(event) => setAssignmentSearch(event.target.value)} placeholder="이름 또는 사번 검색" /></label><div className="assignment-learner-list">{filteredAssignmentLearners.map((learner) => <label className={form.assignedLearnerIds.includes(learner.id) ? `selected` : ``} key={learner.id}><input type="checkbox" checked={form.assignedLearnerIds.includes(learner.id)} onChange={() => toggleAssignmentValue(`assignedLearnerIds`, learner.id)} /><span>{learner.name[0]}</span><div><b>{learner.name}</b><small>{learner.employeeNumber} · {learner.dept} · {learner.position}</small></div></label>)}</div></div>}
          <div className="assignment-settings">
            <label className="assignment-required"><input type="checkbox" checked={form.requiredTraining} onChange={(event) => update(`requiredTraining`, event.target.checked)} /><span><b>필수 교육으로 배정</b><small>대상 학습자의 나의 학습에 자동으로 추가됩니다.</small></span></label>
            <div className="assignment-deadline"><label><input type="checkbox" checked={form.assignmentDeadlineEnabled} onChange={(event) => update(`assignmentDeadlineEnabled`, event.target.checked)} /><span><b>학습 기한 설정</b><small>{form.assignmentDeadlineEnabled ? `기한 내 수료가 필요합니다.` : `기한 없음`}</small></span></label>{form.assignmentDeadlineEnabled && <input type="date" onClick={openNativeDatePicker} value={form.assignmentDeadline} min="2026-08-01" onChange={(event) => update(`assignmentDeadline`, event.target.value)} />}</div>
          </div>
        </div>
      </section>
      <section ref={sectionRefs.lessons} data-section="lessons" id="course-lessons-section" className="panel editor-section course-builder-section">
        <div className="editor-section-head">
          <div>
            <span>02</span>
            <div><h3>커리큘럼 및 차시</h3><p>차시별 학습 콘텐츠를 구성합니다.</p></div>
          </div>
        </div>
        <label className="curriculum-summary">
          커리큘럼 소개
          <textarea
            rows="3"
            value={form.curriculumSummary}
            placeholder="교육과정의 전체 학습 흐름을 입력해주세요."
            onChange={(event) =>
              update(`curriculumSummary`, event.target.value)
            }
          />
        </label>
        <div className="lesson-manage-list">
          {form.lessons.length === 0 && <div className="course-builder-empty">등록된 차시가 없습니다.</div>}
          {form.lessons.map((item, index) => (
            <article key={index} onDragOver={(event) => event.preventDefault()} onDrop={() => { if (draggingLesson === null || draggingLesson === index) return; setForm((current) => { const lessons = [...current.lessons]; const [moved] = lessons.splice(draggingLesson, 1); lessons.splice(index, 0, moved); return { ...current, lessons }; }); setDraggingLesson(null); setDirty(true); }}>
              <span className="lesson-drag" draggable onDragStart={() => setDraggingLesson(index)} title="드래그하여 순서 변경">⋮⋮</span>
              <span className="lesson-number">{String(index + 1).padStart(2, `0`)}</span>
              <div>
                <small>
                  {index + 1}차시{item.duration ? ` · ${item.duration}` : ``}
                </small>
                <b>{item.title}</b>
                <p>{item.description}</p>
              </div>
              <div className="lesson-setting-tags">
                <span className={item.videoUrl ? `done` : ``}>
                  <Icon icon={PlayIcon} size={13} />
                  {item.videoUrl ? `영상 등록` : `영상 미등록`}
                </span>
                <span><Icon icon={File01Icon} size={13} />자료 {item.attachments ? `1개` : `없음`}</span>
                <span className={item.quizEnabled ? `done` : ``}>
                  <Icon icon={Quiz01Icon} size={13} />
                  {item.quizEnabled
                    ? `퀴즈 ${item.quiz.length}문항`
                    : `퀴즈 없음`}
                </span>
              </div>
              <button
                className="secondary"
                onClick={() => setEditingIndex(index)}
              >
                <Icon icon={Edit02Icon} />
                차시 수정
              </button>
              <button type="button" className="lesson-delete-icon" aria-label={`${index + 1}차시 삭제`} title="차시 삭제" onClick={(event) => { event.stopPropagation(); setLessonDeleteIndex(index); }}><Icon icon={Delete02Icon} size={17} /></button>
            </article>
          ))}
        </div>
        <button className="add-question" onClick={addLesson}>
          <Icon icon={Add01Icon} />
          차시 추가
        </button>
      </section>
      <section ref={sectionRefs.survey} data-section="survey" id="course-survey-section" className="panel editor-section course-survey-compact course-builder-section">
        <div className="editor-section-head survey-builder-head">
          <div>
            <span>03</span>
            <div><h3>수료 후 설문</h3><p>Google Forms 설문을 연결합니다.</p></div>
          </div>
          <div className="survey-editor-actions">
            <button type="button" aria-label={form.surveyEnabled ? `설문 사용 중` : `설문 사용 안 함`} className={form.surveyEnabled ? `rule-switch on` : `rule-switch`} onClick={() => update(`surveyEnabled`, !form.surveyEnabled)}><i /></button>
          </div>
        </div>
        {form.surveyEnabled && (
          <div className="google-form-connect">
            <div className="google-form-connect-head"><h4>Google Forms 설문</h4></div>
            <div className="google-form-action-row"><a className="google-form-edit-link" href="https://docs.google.com/forms/u/0/?tgif=d" target="_blank" rel="noreferrer"><Icon icon={Add01Icon} size={16} />새 설문 만들기 ↗</a>{googleFormId(form.googleFormUrl) && <a className="google-form-results-link" href={googleFormResultsUrl(form.googleFormUrl)} target="_blank" rel="noreferrer">응답 결과 보기 ↗</a>}</div>
            <div className="google-form-link-row"><label>설문 응답 링크<input value={form.googleFormUrl} placeholder="응답자가 접속할 수 있는 Google Forms 링크를 붙여넣어주세요" onChange={(event) => update(`googleFormUrl`, event.target.value)} /><small>Google Forms에서 설문을 완성한 후 응답용 링크를 복사해 붙여넣어주세요.</small></label></div>
            {form.googleFormUrl && !googleFormId(form.googleFormUrl) && <p className="google-form-error">올바른 Google Forms 링크를 입력해주세요.</p>}
            {googleFormId(form.googleFormUrl) && <div className="google-form-preview"><h4>설문지 미리보기</h4><iframe className="google-form-inline-frame" src={googleFormEmbedUrl(form.googleFormUrl)} title="Google Forms 수료 후 설문" /></div>}
          </div>
        )}
      </section>
      <div className="course-editor-final-actions course-builder-savebar"><div><button className="primary" onClick={save}>{isNew ? `교육과정 등록` : `저장`}</button></div></div>
      {lesson && (
        <div
          className="overlay"
          onMouseDown={(event) =>
            event.target === event.currentTarget && setEditingIndex(null)
          }
        >
          <aside className="drawer lesson-studio-drawer">
            <div className="drawer-head">
              <div>
                <span>{editingIndex + 1}차시 편집</span>
                <h2>{lesson.title || `차시명을 입력해 주세요`}</h2>
              </div>
              <button onClick={() => setEditingIndex(null)}>
                <Icon icon={Cancel01Icon} />
              </button>
            </div>
            <div className="lesson-studio-content">
              <div className="lesson-video-preview">
              {youtubeEmbedUrl(lesson.videoUrl) ? (
                <iframe
                  src={youtubeEmbedUrl(lesson.videoUrl)}
                  title="강의 영상 미리보기"
                  allowFullScreen
                />
              ) : (
                <div>
                  <Icon icon={PlayIcon} size={28} />
                  <b>영상 미리보기</b>
                  <span>YouTube 링크를 입력하면 영상이 표시됩니다.</span>
                </div>
              )}
              </div>
              <div className="lesson-studio-form">
              <div className="lesson-drawer-section-title"><span>01</span><div><h3>기본 내용</h3><p>차시 제목과 학습 안내를 입력합니다.</p></div></div>
              <label>
                차시명
                <input
                  value={lesson.title}
                  placeholder="차시명을 입력해 주세요"
                  onChange={(event) =>
                    updateLesson(`title`, event.target.value)
                  }
                />
              </label>
              <label>
                학습 내용 / 안내
                <textarea
                  rows="3"
                  value={lesson.description}
                  placeholder="차시 소개를 입력해 주세요"
                  onChange={(event) =>
                    updateLesson(`description`, event.target.value)
                  }
                />
              </label>
              <div className="lesson-drawer-section-title"><span>02</span><div><h3>영상 및 자료</h3><p>학습 영상과 제공 자료를 설정합니다.</p></div></div>
              <div className="lesson-inline-fields">
                <label>
                  학습 시간
                  <input
                    value={lesson.duration}
                    onChange={(event) =>
                      updateLesson(`duration`, event.target.value)
                    }
                    placeholder="예: 24분"
                  />
                </label>
                <label>
                  YouTube 영상 링크
                  <input
                    value={lesson.videoUrl}
                    onChange={(event) =>
                      updateLesson(`videoUrl`, event.target.value)
                    }
                    placeholder="https://youtu.be/..."
                  />
                </label>
              </div>
              <label>
                학습 목표
                <textarea
                  rows="3"
                  value={lesson.goals}
                  onChange={(event) =>
                    updateLesson(`goals`, event.target.value)
                  }
                  placeholder="목표를 줄바꿈으로 구분해 주세요"
                />
              </label>
              <label>
                주요 내용
                <textarea
                  rows="4"
                  value={lesson.contents}
                  onChange={(event) =>
                    updateLesson(`contents`, event.target.value)
                  }
                  placeholder="주요 내용을 줄바꿈으로 구분해 주세요"
                />
              </label>
              <div className="lesson-attachment-builder"><b>첨부자료</b>{lesson.attachments ? <div><Icon icon={File01Icon} /><span>{lesson.attachments}</span><button onClick={() => updateLesson(`attachments`, `새 첨부자료.pdf`)}>교체</button><button className="delete" onClick={() => updateLesson(`attachments`, ``)}>삭제</button></div> : <p>등록된 첨부자료가 없습니다.</p>}<button className="attachment-add" onClick={() => updateLesson(`attachments`, `새 첨부자료.pdf`)}><Icon icon={Add01Icon} />자료 추가</button></div>
              <div className="lesson-quiz-setting">
                <div>
                  <div>
                    <b>차시 퀴즈</b>
                    <span>4지선다형 1문항을 직접 입력하거나 YouTube 영상으로 자동 생성합니다.</span>
                  </div>
                  <div className="lesson-quiz-header-actions">
                  {lesson.quizEnabled && <button type="button" className="ai-quiz-generate-button" disabled={generatingQuiz || !lesson.videoUrl?.trim()} onClick={generateAiQuiz}>{generatingQuiz ? `영상 분석 중…` : `✦ 퀴즈 자동 생성하기`}</button>}
                  <button
                    className={
                      lesson.quizEnabled ? `rule-switch on` : `rule-switch`
                    }
                    onClick={() =>
                      updateLesson(`quizEnabled`, !lesson.quizEnabled)
                    }
                  >
                    <i />
                  </button>
                  </div>
                </div>
                {lesson.quizEnabled && (
                  <>
                    <p className="ai-quiz-generator-note">공개 YouTube 링크를 먼저 등록하면 AI가 선택지 4개와 정답·해설을 생성합니다. 생성 후 내용을 검토하고 저장해 주세요.</p>
                    <div className="lesson-quiz-list">
                      {(lesson.quiz || []).map((question, index) => (
                        <article key={index}>
                          <div className="quiz-builder-head"><b>Q{index + 1}</b></div>
                          <label className="quiz-question-field">질문<input className="quiz-question-input" value={question.question} placeholder="질문을 입력해주세요" onChange={(event) => updateQuiz(index, `question`, event.target.value)} /></label>
                          <div className="quiz-option-list">{[...(question.options || []), ``, ``, ``, ``].slice(0,4).map((option, optionIndex) => {
                            const correctOption = Number.isInteger(question.correctOption) ? question.correctOption : Math.max(0, (question.options || []).indexOf(question.answer));
                            return <div key={optionIndex} className={correctOption === optionIndex ? `correct` : ``}><input type="radio" name={`quiz-${index}-correct`} aria-label={`${optionIndex + 1}번 선택지를 정답으로 지정`} checked={correctOption === optionIndex} onChange={() => updateLesson(`quiz`, lesson.quiz.map((item, itemIndex) => itemIndex === index ? { ...item, correctOption: optionIndex, answer: option } : item))} /><input value={option} placeholder={`선택지 ${optionIndex + 1}`} onChange={(event) => updateQuizOption(index, optionIndex, event.target.value)} /><button type="button" aria-label={`${optionIndex + 1}번 선택지 삭제`} onClick={() => removeQuizOption(index, optionIndex)}>×</button></div>;
                          })}</div>
                          <label className="quiz-question-field">정답 해설<textarea rows="2" value={question.explanation || ``} placeholder="정답인 이유를 입력해주세요" onChange={(event) => updateQuiz(index, `explanation`, event.target.value)} /></label>
                          {question.evidenceTimestamp && <p className="ai-quiz-evidence">영상 근거 시각: {question.evidenceTimestamp}</p>}
                          <div className="quiz-builder-actions"><button className="delete" onClick={() => updateLesson(`quiz`, lesson.quiz.filter((_, itemIndex) => itemIndex !== index))}>삭제</button></div>
                        </article>
                      ))}
                    </div>
                    {!lesson.quiz?.length && <button className="add-question" onClick={addQuiz}>
                      <Icon icon={Add01Icon} />
                      퀴즈 1문항 직접 만들기
                    </button>}
                  </>
                )}
              </div>
              </div>
            </div>
            <div className="lesson-studio-actions">
              <button className="secondary" onClick={() => setEditingIndex(null)}>취소</button>
              <button className="primary" onClick={() => setEditingIndex(null)}>
                저장
              </button>
            </div>
          </aside>
        </div>
      )}
      {coursePreview && <div className="survey-preview-overlay course-preview-overlay" onMouseDown={(event) => event.target === event.currentTarget && setCoursePreview(false)}><div className="course-user-preview"><button className="course-user-preview-close" onClick={() => setCoursePreview(false)} aria-label="미리보기 닫기">×</button><X course={{ ...selected, title: form.title || `제목 없는 교육과정`, category: form.category || `분야`, status: form.status || `오픈 전`, level: form.level || `레벨`, description: form.introduction, introduction: form.introduction, curriculumSummary: form.curriculumSummary, curriculum: form.lessons, thumbnail: form.thumbnail, period: form.startDate && form.endDate ? `${form.startDate.replaceAll(`-`, `.`)} ~ ${form.endDate.replaceAll(`-`, `.`)}` : `교육 기간 미설정` }} go={() => {}} apply={() => {}} preview /></div></div>}
    </div>
  );
}

function SurveyQuestionEditor({
  question,
  index,
  total,
  onUpdate,
  onRemove,
  onMove,
  onDuplicate,
  active,
  onActivate,
  onDragStart,
  onDrop,
}) {
  const hasOptions = [`단일 선택`, `복수 선택`].includes(question.type);
  const updateOption = (optionIndex, value) =>
    onUpdate(
      index,
      `options`,
      question.options.map((option, i) => (i === optionIndex ? value : option)),
    );
  return (
    <article className={`survey-question-editor ${active ? `active` : ``}`} onClick={onActivate} onDragOver={(event) => event.preventDefault()} onDrop={onDrop}>
      <div className="survey-question-editor-head">
        <span className="survey-drag-handle" draggable onDragStart={onDragStart} title="드래그하여 순서 변경">⋮⋮</span>
        <b>Q{index + 1}</b>
      </div>
      <div className="survey-question-editor-fields">
        <label className="wide">
          <input
            aria-label={`Q${index + 1} 질문`}
            value={question.question}
            placeholder="질문을 입력해주세요"
            onChange={(event) =>
              onUpdate(index, `question`, event.target.value)
            }
          />
        </label>
        <label className="survey-type-select">
          <select
            value={question.type}
            onChange={(event) => onUpdate(index, `type`, event.target.value)}
          >
            {[`5점 척도`, `단일 선택`, `복수 선택`, `주관식`].map((type) => (
              <option key={type}>{type}</option>
            ))}
          </select>
        </label>
      </div>
      {question.type === `5점 척도` && (
        <div className="scale-label-editor">
          <label>
            <input
              aria-label="1점 설명"
              value={question.lowLabel || ``}
              placeholder="매우 그렇지 않다"
              onChange={(event) =>
                onUpdate(index, `lowLabel`, event.target.value)
              }
            />
          </label>
          <div>☆ ☆ ☆ ☆ ☆</div>
          <label>
            <input
              aria-label="5점 설명"
              value={question.highLabel || ``}
              placeholder="매우 그렇다"
              onChange={(event) =>
                onUpdate(index, `highLabel`, event.target.value)
              }
            />
          </label>
        </div>
      )}
      {hasOptions && (
        <div className="survey-option-editor">
          {(question.options || []).map((option, optionIndex) => (
            <div key={optionIndex}>
              <span>{question.type === `단일 선택` ? `○` : `□`}</span>
              <input
                value={option}
                placeholder="선택지 입력"
                onChange={(event) =>
                  updateOption(optionIndex, event.target.value)
                }
              />
              <button
                onClick={() =>
                  onUpdate(
                    index,
                    `options`,
                    question.options.filter((_, i) => i !== optionIndex),
                  )
                }
              >
                ×
              </button>
            </div>
          ))}
          <button
            onClick={() =>
              onUpdate(index, `options`, [
                ...(question.options || []),
                ``,
              ])
            }
          >
            + 선택지 추가
          </button>
        </div>
      )}
      {question.type === `주관식` && (
        <textarea
          className="survey-textarea-preview"
          rows="3"
          disabled
          placeholder="장문형 답변"
        />
      )}
      <div className="survey-question-actions">
        <div><button onClick={() => onDuplicate(index)}>복제</button><button className="delete" onClick={() => onRemove(index)}>삭제</button></div>
        <label><span>필수 응답</span><button type="button" className={question.required ? `rule-switch on` : `rule-switch`} onClick={() => onUpdate(index, `required`, !question.required)}><i /></button></label>
      </div>
    </article>
  );
}

function SurveyFormView({ survey, mode = `response`, results = null }) {
  return (
    <div className={`shared-survey-form ${mode}`}>
      <div className="shared-survey-intro">
        <p>{survey.surveyDescription || survey.description}</p>
        <span>
          {survey.surveyAnonymous !== false ? `익명 응답` : `기명 응답`} ·
          별표(*)는 필수 문항입니다.
        </span>
      </div>
      <div className="shared-survey-questions">
        {survey.surveyQuestions.map((question, index) => (
          <SurveyQuestionView
            key={question.id || index}
            question={question}
            index={index}
            mode={mode}
            result={results?.[index]}
          />
        ))}
      </div>
    </div>
  );
}

function SurveyQuestionView({ question, index, mode, result }) {
  const responseMode = mode === `response`;
  return (
    <section className="shared-survey-question">
      <h3>
        <span>Q{index + 1}.</span> {question.question}{" "}
        {question.required && <i>*</i>}
      </h3>
      {question.type === `5점 척도` &&
        (responseMode ? (
          <div className="survey-star-response">
            <div>
              {[1, 2, 3, 4, 5].map((score) => (
                <label key={score}>
                  <input type="radio" name={`survey-star-${index}`} />
                  <span>☆</span>
                  <small>{score}</small>
                </label>
              ))}
            </div>
            <p>
              <span>1점 {question.lowLabel}</span>
              <span>5점 {question.highLabel}</span>
            </p>
          </div>
        ) : (
          <SurveyScaleResult result={result} />
        ))}
      {[`단일 선택`, `복수 선택`].includes(question.type) &&
        (responseMode ? (
          <div className="survey-choice-response">
            {question.options.map((option) => (
              <label key={option}>
                <input
                  type={question.type === `단일 선택` ? `radio` : `checkbox`}
                  name={`survey-choice-${index}`}
                />
                {option}
              </label>
            ))}
          </div>
        ) : (
          <SurveyChoiceResult result={result} type={question.type} />
        ))}
      {question.type === `주관식` &&
        (responseMode ? (
          <textarea rows="5" placeholder="의견을 입력해 주세요." />
        ) : (
          <SurveyTextResult result={result} />
        ))}
    </section>
  );
}

function SurveyScaleResult({ result }) {
  return (
    <div className="survey-question-result">
      <div className="survey-average-stars">
        <span>
          ★★★★<i>☆</i>
        </span>
        <b>{result.average} / 5</b>
        <small>{result.responses}명 응답</small>
      </div>
      <div className="survey-distribution-list">
        {result.distribution.map((item) => (
          <SurveyDistributionRow key={item.label} item={item} />
        ))}
      </div>
    </div>
  );
}
function SurveyChoiceResult({ result, type }) {
  return (
    <div className="survey-distribution-list choice">
      {result.distribution.map((item) => (
        <SurveyDistributionRow
          key={item.label}
          item={{
            ...item,
            label: `${type === `단일 선택` ? `○` : `□`} ${item.label}`,
          }}
        />
      ))}
      {type === `복수 선택` && (
        <small className="multiple-note">
          복수 선택 문항으로 비율 합계가 100%를 초과할 수 있습니다.
        </small>
      )}
    </div>
  );
}
function SurveyDistributionRow({ item }) {
  return (
    <div className="survey-distribution-row">
      <div>
        <span>{item.label}</span>
        <b>
          {item.count}명 · {item.percent}%
        </b>
      </div>
      <i>
        <b style={{ width: `${Math.min(item.percent, 100)}%` }} />
      </i>
    </div>
  );
}
function SurveyTextResult({ result }) {
  const [showAll, setShowAll] = r.useState(false);
  return (
    <div className="survey-text-results">
      <span>응답 {result.responses}개</span>
      <div>
        {result.comments
          .slice(0, showAll ? result.comments.length : 4)
          .map((comment, index) => (
            <p key={`${comment}-${index}`}>“{comment}”</p>
          ))}
      </div>
      <button onClick={() => setShowAll(!showAll)}>
        {showAll ? `대표 답변만 보기` : `전체 답변 보기`}
      </button>
    </div>
  );
}

function _({ onEdit: e }) {
  return (0, i.jsxs)(`section`, {
    className: `course-list-page`,
    children: [
      (0, i.jsx)(g, {}),
      (0, i.jsxs)(`div`, {
        className: `course-list-head`,
        children: [
          (0, i.jsx)(`span`, { children: `전체 교육과정` }),
          (0, i.jsxs)(`b`, { children: [a.length, `개`] }),
        ],
      }),
      (0, i.jsx)(`div`, {
        className: `table-wrap course-table`,
        children: (0, i.jsxs)(`table`, {
          children: [
            (0, i.jsx)(`thead`, {
              children: (0, i.jsxs)(`tr`, {
                children: [
                  (0, i.jsx)(`th`, { children: `교육과정` }),
                  (0, i.jsx)(`th`, { children: `교육 기간` }),
                  (0, i.jsx)(`th`, { children: `학습자` }),
                  (0, i.jsx)(`th`, { children: `평균 진도율` }),
                  (0, i.jsx)(`th`, { children: `상태` }),
                  (0, i.jsx)(`th`, { children: `관리` }),
                ],
              }),
            }),
            (0, i.jsx)(`tbody`, {
              children: a.map((t) =>
                (0, i.jsxs)(
                  `tr`,
                  {
                    children: [
                      (0, i.jsxs)(`td`, {
                        children: [
                          (0, i.jsx)(`b`, { children: t.title }),
                          (0, i.jsx)(`small`, { children: t.category }),
                        ],
                      }),
                      (0, i.jsx)(`td`, { children: t.period }),
                      (0, i.jsxs)(`td`, { children: [t.learners, `명`] }),
                      (0, i.jsx)(`td`, {
                        children:
                          t.status === `오픈 전`
                            ? (0, i.jsx)(`span`, {
                                className: `not-started`,
                                children: `—`,
                              })
                            : (0, i.jsxs)(`div`, {
                                className: `table-progress`,
                                children: [
                                  (0, i.jsx)(d, { value: t.rate }),
                                  (0, i.jsxs)(`span`, {
                                    children: [t.rate, `%`],
                                  }),
                                ],
                              }),
                      }),
                      (0, i.jsx)(`td`, {
                        children: (0, i.jsx)(h, { status: t.status }),
                      }),
                      (0, i.jsx)(`td`, {
                        children: (0, i.jsx)(`div`, {
                          className: `actions`,
                          children: (0, i.jsx)(`button`, {
                            className: `edit-course`,
                            onClick: () => e(t),
                            title: `과정 관리`,
                            children: (0, i.jsx)(Icon, { icon: Edit02Icon }),
                          }),
                        }),
                      }),
                    ],
                  },
                  t.id,
                ),
              ),
            }),
          ],
        }),
      }),
    ],
  });
}
function v({ selected: e, onBack: t }) {
  const initialLessons =
    e.curriculum ||
    [
      {
        title: `교육 소개 및 학습 안내`,
        description: `과정의 목표와 전체 학습 흐름을 확인합니다.`,
        content: `강의 영상 · 18분`,
        quiz: `AI 자동 생성 · 3문항`,
      },
      {
        title: `핵심 개념 이해`,
        description: `업무에 필요한 핵심 개념과 기본 원리를 학습합니다.`,
        content: `강의 영상 · 24분`,
        quiz: `AI 자동 생성 · 3문항`,
      },
      {
        title: `실무 사례 분석`,
        description: `실제 업무 사례를 통해 적용 방법을 살펴봅니다.`,
        content: `강의 영상 · 22분`,
        quiz: `직접 등록 · 5문항`,
      },
      {
        title: `업무 적용 실습`,
        description: `학습 내용을 자신의 업무 상황에 직접 적용합니다.`,
        content: `강의 영상 · 20분`,
        quiz: `사용 안 함`,
      },
      {
        title: `최종 점검 및 설문`,
        description: `핵심 내용을 복습하고 학습을 마무리합니다.`,
        content: `강의 영상 · 15분`,
        quiz: `AI 자동 생성 · 5문항`,
      },
    ].slice(0, e.lessons || 5);
  const [form, setForm] = (0, r.useState)({
    title: e.title || ``,
    category: e.category || `직무역량`,
    status: e.status || `오픈 전`,
    department: e.department || `전체 부서`,
    position: e.position || `전체 직급`,
    period: e.period || ``,
    introduction:
      e.introduction ||
      `${e.title} 과정의 핵심 개념을 이해하고 실제 업무에 활용할 수 있도록 구성된 교육과정입니다.`,
    curriculumSummary:
      e.curriculumSummary ||
      `기초 개념부터 실무 적용까지 단계적으로 학습합니다.`,
    thumbnail: e.thumbnail || ``,
    curriculum: initialLessons,
    quizQuestions: e.quizQuestions || [
      {
        question: `강의의 핵심 내용을 가장 잘 설명한 것은 무엇인가요?`,
        type: `객관식`,
        score: 20,
      },
      {
        question: `실무 적용 시 가장 먼저 확인해야 할 사항을 작성해 주세요.`,
        type: `주관식`,
        score: 20,
      },
    ],
    surveyQuestions: e.surveyQuestions || [
      { question: `교육 내용에 전반적으로 만족하셨나요?`, type: `5점 척도` },
      {
        question: `업무에 도움이 된 내용을 자유롭게 작성해 주세요.`,
        type: `서술형`,
      },
    ],
  });
  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));
  const updateLesson = (index, key, value) =>
    setForm((prev) => ({
      ...prev,
      curriculum: prev.curriculum.map((lesson, i) =>
        i === index ? { ...lesson, [key]: value } : lesson,
      ),
    }));
  const addLesson = () =>
    setForm((prev) => ({
      ...prev,
      curriculum: [
        ...prev.curriculum,
        {
          title: `새 차시`,
          description: `차시별 강의 소개를 입력해 주세요.`,
          content: `강의 영상`,
          quiz: `사용 안 함`,
        },
      ],
    }));
  const removeLesson = (index) =>
    setForm((prev) => ({
      ...prev,
      curriculum: prev.curriculum.filter((_, i) => i !== index),
    }));
  const updateQuestion = (group, index, key, value) =>
    setForm((prev) => ({
      ...prev,
      [group]: prev[group].map((item, itemIndex) =>
        itemIndex === index ? { ...item, [key]: value } : item,
      ),
    }));
  const addQuestion = (group) =>
    setForm((prev) => ({
      ...prev,
      [group]: [
        ...prev[group],
        group === `quizQuestions`
          ? { question: `새 퀴즈 문항`, type: `객관식`, score: 20 }
          : { question: `새 설문 문항`, type: `5점 척도` },
      ],
    }));
  const removeQuestion = (group, index) =>
    setForm((prev) => ({
      ...prev,
      [group]: prev[group].filter((_, itemIndex) => itemIndex !== index),
    }));
  const uploadThumbnail = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => update(`thumbnail`, reader.result);
    reader.readAsDataURL(file);
  };
  const save = () => {
    Object.assign(e, { ...form, lessons: form.curriculum.length });
    alert(`교육과정 정보가 저장되었습니다.`);
  };
  return (
    <div className="course-manage-page course-editor-page">
      <button className="back-to-list" onClick={t}>
        <Icon icon={ArrowLeft01Icon} />
        교육과정 목록으로
      </button>

      <section className="course-editor-hero">
        <div className="course-thumbnail-editor">
          <div className="course-thumbnail-preview">
            {form.thumbnail ? (
              <img src={form.thumbnail} alt="강의 썸네일 미리보기" />
            ) : (
              <div>
                <b>강의 썸네일</b>
                <span>권장 비율 16:9</span>
              </div>
            )}
          </div>
          <label className="secondary thumbnail-upload">
            이미지 변경
            <input type="file" accept="image/*" onChange={uploadThumbnail} />
          </label>
          <input
            value={form.thumbnail}
            onChange={(event) => update(`thumbnail`, event.target.value)}
            placeholder="또는 이미지 URL을 입력해 주세요"
          />
        </div>
        <div className="course-editor-heading">
          <span>교육과정 상세 수정</span>
          <h2>{form.title || `과정명을 입력해 주세요`}</h2>
          <p>
            과정의 기본 정보부터 커리큘럼과 차시별 콘텐츠까지 한 화면에서 수정할
            수 있습니다.
          </p>
          <div className="content-actions">
            <button
              className="danger-outline"
              onClick={() => confirm(`이 교육과정을 삭제하시겠습니까?`)}
            >
              과정 삭제
            </button>
            <button className="primary" onClick={save}>
              변경사항 저장
            </button>
          </div>
        </div>
      </section>

      <section className="panel editor-section">
        <div className="editor-section-head">
          <div>
            <span>01</span>
            <h3>강의 기본 정보</h3>
          </div>
          <p>사용자 화면에 표시되는 과정 정보를 입력해 주세요.</p>
        </div>
        <div className="course-edit-grid">
          <label className="wide">
            강의 제목
            <input
              value={form.title}
              onChange={(event) => update(`title`, event.target.value)}
            />
          </label>
          <label>
            분야
            <select
              value={form.category}
              onChange={(event) => update(`category`, event.target.value)}
            >
              {[`직무역량`, `리더십`, `AX`, `법정필수`].map((value) => (
                <option key={value}>{value}</option>
              ))}
            </select>
          </label>
          <label>
            상태
            <select
              value={form.status}
              onChange={(event) => update(`status`, event.target.value)}
            >
              {[`오픈 전`, `운영 중`, `종료`].map((value) => (
                <option key={value}>{value}</option>
              ))}
            </select>
          </label>
          <label>
            대상 부서
            <select
              value={form.department}
              onChange={(event) => update(`department`, event.target.value)}
            >
              {[
                `전체 부서`,
                `People팀`,
                `개발팀`,
                `마케팅팀`,
                `세일즈팀`,
                `운영팀`,
              ].map((value) => (
                <option key={value}>{value}</option>
              ))}
            </select>
          </label>
          <label>
            대상 직급
            <select
              value={form.position}
              onChange={(event) => update(`position`, event.target.value)}
            >
              {[`전체 직급`, `인턴`, `매니저`, `파트장`, `팀장`].map(
                (value) => (
                  <option key={value}>{value}</option>
                ),
              )}
            </select>
          </label>
          <label className="wide">
            교육 기간
            <input
              value={form.period}
              onChange={(event) => update(`period`, event.target.value)}
              placeholder="예: 2026.08.01 ~ 2026.09.30"
            />
          </label>
          <label className="wide">
            강의 소개
            <textarea
              rows="5"
              value={form.introduction}
              onChange={(event) => update(`introduction`, event.target.value)}
            />
          </label>
        </div>
      </section>

      <section className="panel editor-section">
        <div className="editor-section-head">
          <div>
            <span>02</span>
            <h3>커리큘럼</h3>
          </div>
          <p>과정 전체의 학습 흐름과 차시별 강의 내용을 구성해 주세요.</p>
        </div>
        <label className="curriculum-summary">
          커리큘럼 소개
          <textarea
            rows="3"
            value={form.curriculumSummary}
            onChange={(event) =>
              update(`curriculumSummary`, event.target.value)
            }
          />
        </label>
        <div className="lesson-editor-list">
          {form.curriculum.map((lesson, index) => (
            <article className="lesson-editor-card" key={index}>
              <div className="lesson-editor-no">
                <span>{String(index + 1).padStart(2, `0`)}</span>
                <b>{index + 1}차시</b>
              </div>
              <div className="lesson-editor-fields">
                <label>
                  차시명
                  <input
                    value={lesson.title}
                    onChange={(event) =>
                      updateLesson(index, `title`, event.target.value)
                    }
                  />
                </label>
                <label>
                  차시별 강의 소개
                  <textarea
                    rows="3"
                    value={lesson.description}
                    onChange={(event) =>
                      updateLesson(index, `description`, event.target.value)
                    }
                  />
                </label>
                <label>
                  강의 영상·자료 정보
                  <input
                    value={lesson.content}
                    onChange={(event) =>
                      updateLesson(index, `content`, event.target.value)
                    }
                    placeholder="예: 강의 영상 · 18분 / PDF 자료 1개"
                  />
                </label>
                <label>
                  퀴즈 설정
                  <select
                    value={lesson.quiz || `사용 안 함`}
                    onChange={(event) =>
                      updateLesson(index, `quiz`, event.target.value)
                    }
                  >
                    <option>사용 안 함</option>
                    <option>AI 자동 생성 · 3문항</option>
                    <option>AI 자동 생성 · 5문항</option>
                    <option>직접 등록 · 5문항</option>
                  </select>
                </label>
              </div>
              <button
                className="remove-lesson"
                onClick={() => removeLesson(index)}
                title="차시 삭제"
              >
                <Icon icon={Delete02Icon} />
              </button>
            </article>
          ))}
        </div>
        <button className="add-lesson" onClick={addLesson}>
          <Icon icon={Add01Icon} />
          차시 추가
        </button>
      </section>

      <section className="panel editor-section assessment-editor-section">
        <div className="editor-section-head">
          <div>
            <span>03</span>
            <h3>퀴즈 설정</h3>
          </div>
          <p>이 과정에서 사용할 평가 문항을 작성하고 수정합니다.</p>
        </div>
        <div className="question-editor-list">
          {form.quizQuestions.map((item, index) => (
            <article className="question-editor-row" key={`quiz-${index}`}>
              <b>Q{index + 1}</b>
              <input
                value={item.question}
                onChange={(event) =>
                  updateQuestion(
                    `quizQuestions`,
                    index,
                    `question`,
                    event.target.value,
                  )
                }
              />
              <select
                value={item.type}
                onChange={(event) =>
                  updateQuestion(
                    `quizQuestions`,
                    index,
                    `type`,
                    event.target.value,
                  )
                }
              >
                <option>객관식</option>
                <option>복수 선택</option>
                <option>주관식</option>
              </select>
              <label>
                <input
                  type="number"
                  value={item.score}
                  onChange={(event) =>
                    updateQuestion(
                      `quizQuestions`,
                      index,
                      `score`,
                      event.target.value,
                    )
                  }
                />
                점
              </label>
              <button
                onClick={() => removeQuestion(`quizQuestions`, index)}
                title="문항 삭제"
              >
                <Icon icon={Delete02Icon} />
              </button>
            </article>
          ))}
        </div>
        <button
          className="add-question"
          onClick={() => addQuestion(`quizQuestions`)}
        >
          <Icon icon={Add01Icon} />
          퀴즈 문항 추가
        </button>
      </section>

      <section className="panel editor-section assessment-editor-section">
        <div className="editor-section-head">
          <div>
            <span>04</span>
            <h3>설문 설정</h3>
          </div>
          <p>수강 완료 후 노출할 만족도 설문을 구성합니다.</p>
        </div>
        <div className="question-editor-list">
          {form.surveyQuestions.map((item, index) => (
            <article
              className="question-editor-row survey-question-row"
              key={`survey-${index}`}
            >
              <b>{index + 1}</b>
              <input
                value={item.question}
                onChange={(event) =>
                  updateQuestion(
                    `surveyQuestions`,
                    index,
                    `question`,
                    event.target.value,
                  )
                }
              />
              <select
                value={item.type}
                onChange={(event) =>
                  updateQuestion(
                    `surveyQuestions`,
                    index,
                    `type`,
                    event.target.value,
                  )
                }
              >
                <option>5점 척도</option>
                <option>단일 선택</option>
                <option>서술형</option>
              </select>
              <button
                onClick={() => removeQuestion(`surveyQuestions`, index)}
                title="문항 삭제"
              >
                <Icon icon={Delete02Icon} />
              </button>
            </article>
          ))}
        </div>
        <button
          className="add-question"
          onClick={() => addQuestion(`surveyQuestions`)}
        >
          <Icon icon={Add01Icon} />
          설문 문항 추가
        </button>
      </section>

      <div className="course-editor-footer">
        <button className="secondary" onClick={t}>
          취소
        </button>
        <button className="primary" onClick={save}>
          변경사항 저장
        </button>
      </div>
      {assignmentListOpen && <div className="overlay center assignment-list-overlay" onMouseDown={() => setAssignmentListOpen(false)}><section className="assignment-list-modal" onMouseDown={(event) => event.stopPropagation()}><header><div><h2>배정 대상</h2><p>{form.title || selected.title} · 총 {assignedLearners.length}명</p></div><button onClick={() => setAssignmentListOpen(false)} aria-label="닫기"><Icon icon={Cancel01Icon} /></button></header><div>{assignedLearners.map((learner) => <article key={learner.id}><span>{learner.name[0]}</span><div><b>{learner.name}</b><small>{learner.id} · {learner.dept} · {learner.position}</small></div></article>)}</div><footer><button className="primary" onClick={() => setAssignmentListOpen(false)}>확인</button></footer></section></div>}
      {lessonDeleteIndex !== null && <ConfirmModal title="차시를 삭제할까요?" description="삭제한 차시와 입력한 학습 콘텐츠는 복구할 수 없습니다." confirmLabel="삭제" onCancel={() => setLessonDeleteIndex(null)} onConfirm={() => removeLesson(lessonDeleteIndex)} />}
      {courseDeleteOpen && <ConfirmModal title="교육과정을 삭제할까요?" description="삭제한 교육과정은 복구할 수 없습니다." confirmLabel="삭제" onCancel={() => setCourseDeleteOpen(false)} onConfirm={() => { setCourseDeleteOpen(false); showAdminToast(`교육과정이 삭제되었습니다.`); onBack(); }} />}
    </div>
  );
}
function LegacyLearnerDepartmentHub({ onSelect }) {
  const [selectedDept, setSelectedDept] = r.useState(null);
  const [query, setQuery] = r.useState(``);
  const [position, setPosition] = r.useState(`전체 직급`);
  const departmentMeta = [
    {
      name: `People팀`,
      icon: UserGroupIcon,
      tone: `blue`,
      members: 24,
      progress: 84,
      completion: 78,
      required: 3,
    },
    {
      name: `개발팀`,
      icon: Analytics01Icon,
      tone: `violet`,
      members: 54,
      progress: 76,
      completion: 69,
      required: 8,
    },
    {
      name: `마케팅팀`,
      icon: ChartHistogramIcon,
      tone: `coral`,
      members: 38,
      progress: 88,
      completion: 83,
      required: 4,
    },
    {
      name: `세일즈팀`,
      icon: RankingIcon,
      tone: `green`,
      members: 46,
      progress: 71,
      completion: 65,
      required: 11,
    },
    {
      name: `운영팀`,
      icon: Settings02Icon,
      tone: `amber`,
      members: 57,
      progress: 81,
      completion: 75,
      required: 7,
    },
    {
      name: `공간디자인팀`,
      icon: File01Icon,
      tone: `sky`,
      members: 29,
      progress: 79,
      completion: 72,
      required: 5,
    },
  ];
  const names = [
    `김수민`,
    `이지은`,
    `박서준`,
    `최하늘`,
    `정유진`,
    `김도윤`,
    `윤서아`,
    `오지훈`,
    `한가람`,
    `서민재`,
    `조하은`,
    `송현우`,
    `강지수`,
    `백승민`,
    `임채원`,
    `문태영`,
    `장예린`,
    `고은호`,
    `유다인`,
    `신재욱`,
    `배서윤`,
    `노준호`,
    `홍예진`,
    `안도현`,
  ];
  const positions = [`인턴`, `매니저`, `팀장`, `파트장`];
  const employees = names.map((name, index) => {
    const dept = departmentMeta[index % departmentMeta.length].name;
    const progress = 48 + ((index * 13) % 51);
    const courses = 3 + (index % 5);
    return {
      id: `SP${String(1024 + index).padStart(4, `0`)}`,
      name,
      dept,
      position: positions[index % positions.length],
      courses,
      progress,
      completed: Math.min(courses, Math.floor(progress / 20)),
      status: `재직`,
    };
  });
  if (!selectedDept)
    return (
      <section className="department-hub">
        <div className="department-hub-intro">
          <div>
            <h2>부서를 선택해 주세요</h2>
            <p>
              부서별 학습 현황을 먼저 확인한 뒤 소속 학습자를 조회할 수
              있습니다.
            </p>
          </div>
          <span>
            전체 학습자 <b>248명</b>
          </span>
        </div>
        <div className="department-card-grid">
          {departmentMeta.map((dept) => (
            <button
              className="department-card"
              key={dept.name}
              onClick={() => {
                setSelectedDept(dept);
                setQuery(``);
                setPosition(`전체 직급`);
              }}
            >
              <div className={`department-icon ${dept.tone}`}>
                <Icon icon={dept.icon} size={22} />
              </div>
              <div className="department-card-title">
                <h3>{dept.name}</h3>
                <span>{dept.members}명</span>
              </div>
              <div className="department-card-metrics">
                <div>
                  <small>평균 진도율</small>
                  <b>{dept.progress}%</b>
                </div>
                <div>
                  <small>수료율</small>
                  <b>{dept.completion}%</b>
                </div>
              </div>
              <div className="department-progress">
                <i style={{ width: `${dept.progress}%` }} />
              </div>
              <span className={dept.required > 7 ? `department-attention` : ``}>
                {dept.required > 7 ? `관리 필요 ` : ``}
                {dept.required}명
              </span>
              <Icon icon={ArrowRight01Icon} className="department-arrow" />
            </button>
          ))}
        </div>
      </section>
    );
  const deptEmployees = employees.filter(
    (employee) =>
      employee.dept === selectedDept.name &&
      (!query ||
        employee.name.includes(query) ||
        employee.id.toLowerCase().includes(query.toLowerCase())) &&
      (position === `전체 직급` || employee.position === position),
  );
  return (
    <section className="department-detail-page">
      <button className="department-back" onClick={() => setSelectedDept(null)}>
        <Icon icon={ArrowLeft01Icon} />
        `전체 부서`
      </button>
      <div className="department-detail-hero">
        <div className={`department-icon large ${selectedDept.tone}`}>
          <Icon icon={selectedDept.icon} size={27} />
        </div>
        <div>
          <span>부서 학습 현황</span>
          <h2>{selectedDept.name}</h2>
          <p>
            소속 학습자의 최근 6개월 교육 참여 데이터를 기준으로 집계했습니다.
          </p>
        </div>
        <strong>
          {selectedDept.members}
          <small>명</small>
        </strong>
      </div>
      <div className="department-summary-strip">
        <div>
          <span>평균 진도율</span>
          <b>{selectedDept.progress}%</b>
          <small>전월 대비 +3.2%p</small>
        </div>
        <div>
          <span>수료율</span>
          <b>{selectedDept.completion}%</b>
          <small>전체 평균 대비 +1.8%p</small>
        </div>
        <div>
          <span>수강 중인 과정</span>
          <b>12개</b>
          <small>필수교육 3개 포함</small>
        </div>
        <div>
          <span>관리 필요 학습자</span>
          <b className="attention-number">{selectedDept.required}명</b>
          <small>진도율 50% 미만</small>
        </div>
      </div>
      <div className="department-analysis-grid">
        <article className="panel department-trend">
          <div className="panel-head">
            <div>
              <h2>월별 평균 진도율</h2>
              <p>3월부터 8월까지의 변화입니다.</p>
            </div>
          </div>
          <div className="department-bars">
            {[
              selectedDept.progress - 18,
              selectedDept.progress - 13,
              selectedDept.progress - 11,
              selectedDept.progress - 7,
              selectedDept.progress - 4,
              selectedDept.progress,
            ].map((value, index) => (
              <div key={index}>
                <span style={{ height: `${value}%` }} />
                <b>{value}%</b>
                <small>{index + 3}월</small>
              </div>
            ))}
          </div>
        </article>
        <article className="panel department-status">
          <div className="panel-head">
            <div>
              <h2>학습 상태</h2>
              <p>현재 배정된 교육 기준입니다.</p>
            </div>
          </div>
          {[
            [`수료`, selectedDept.completion, `green`],
            [`수강 중`, Math.max(8, 92 - selectedDept.completion), `blue`],
            [
              `미수강`,
              Math.max(
                3,
                100 -
                  Math.max(8, 92 - selectedDept.completion) -
                  selectedDept.completion,
              ),
              `coral`,
            ],
          ].map(([label, value, tone]) => (
            <div className="department-status-row" key={label}>
              <span>
                <i className={tone} />
                {label}
              </span>
              <b>{value}%</b>
              <div>
                <i className={tone} style={{ width: `${value}%` }} />
              </div>
            </div>
          ))}
        </article>
      </div>
      <div className="department-learners-head">
        <div>
          <h2>소속 학습자</h2>
          <span>{deptEmployees.length}명</span>
        </div>
      </div>
      <div className="learner-filter-panel compact-department-filter">
        <div className="learner-filter-fields">
          <div className="search">
            <Icon icon={Search01Icon} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="이름 또는 사번 검색"
            />
          </div>
          <select
            value={position}
            onChange={(event) => setPosition(event.target.value)}
          >
            {[`전체 직급`, `인턴`, `매니저`, `파트장`, `팀장`].map((value) => (
              <option key={value}>{value}</option>
            ))}
          </select>
          <button className="filter-search-button">검색</button>
          <button
            className="filter-reset"
            onClick={() => {
              setQuery(``);
              setPosition(`전체 직급`);
            }}
          >
            초기화
          </button>
        </div>
      </div>
      <div className="table-wrap learner-table department-learner-table">
        <table>
          <thead>
            <tr>
              <th>임직원</th>
              <th>직급</th>
              <th>수강 과정</th>
              <th>평균 진도율</th>
              <th>수료</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {deptEmployees.map((employee) => (
              <tr key={employee.id}>
                <td>
                  <div className="person">
                    <span>{employee.name[0]}</span>
                    <div>
                      <b>{employee.name}</b>
                      <small>{employee.id}</small>
                    </div>
                  </div>
                </td>
                <td>{employee.position}</td>
                <td>{employee.courses}개</td>
                <td>
                  <div className="table-progress">
                    {d({ value: employee.progress })}
                    <span>{employee.progress}%</span>
                  </div>
                </td>
                <td>
                  <b className="completed-count">{employee.completed}개</b>
                </td>
                <td>
                  <button className="detail" onClick={() => onSelect(employee)}>
                    자세히 보기
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

const flattenOrganizationTree = (nodes, ancestors = []) => nodes.flatMap((node) => {
  const names = [...ancestors, node.name];
  return [{ ...node, pathLabel: names.join(` > `) }, ...flattenOrganizationTree(node.children || [], names)];
});
function OrganizationTreeNode({ node, selectedId, expandedIds, onSelect, onToggle, userCountByOrganization, depth = 0 }) {
  const children = node.children || [];
  const expanded = expandedIds.has(node.id);
  return <div className="organization-tree-branch">
    <div className={`organization-tree-row ${selectedId === node.id ? `selected` : ``} ${expanded ? `expanded` : ``}`} style={{ "--tree-depth": depth }}>
      <button type="button" className={`organization-tree-toggle ${children.length ? `` : `empty`}`} onClick={() => children.length && onToggle(node.id)} aria-label={expanded ? `${node.name} 접기` : `${node.name} 펼치기`}>
        {children.length ? <Icon icon={ArrowDown01Icon} size={15} /> : null}
      </button>
      <button type="button" className="organization-tree-select" onClick={() => onSelect(node.id)}>
        <span className="organization-tree-icon"><Icon icon={UserGroupIcon} size={16} /></span>
        <span><b>{node.name}</b><small>{Number(node.depth) === 0 ? `0단계 법인` : `${node.depth}단계`} · {userCountByOrganization.get(node.id) || 0}명</small></span>
      </button>
      <span className={`organization-tree-status ${node.status === `ACTIVE` ? `active` : ``}`}>{node.status === `ACTIVE` ? `사용 중` : `비활성`}</span>
    </div>
    {expanded && children.length > 0 && <div className="organization-tree-children">{children.map((child) => <OrganizationTreeNode key={child.id} node={child} selectedId={selectedId} expandedIds={expandedIds} onSelect={onSelect} onToggle={onToggle} userCountByOrganization={userCountByOrganization} depth={depth + 1} />)}</div>}
  </div>;
}
function badgeIconComponent(icon = `medal`) {
  return { medal:Medal01Icon, trophy:Award01Icon, star:SparklesIcon, quiz:Quiz01Icon, book:BookOpen01Icon, ranking:RankingIcon }[icon] || Medal01Icon;
}
const parseCsvLine = (line) => {
  const cells = []; let value = ``, quoted = false;
  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    if (character === `"` && quoted && line[index + 1] === `"`) { value += `"`; index += 1; }
    else if (character === `"`) quoted = !quoted;
    else if (character === `,` && !quoted) { cells.push(value.trim()); value = ``; }
    else value += character;
  }
  cells.push(value.trim()); return cells;
};
const apiRequest = async (url, options = {}) => {
  const response = await fetch(url, { credentials: `include`, headers: { "Content-Type": `application/json`, ...(options.headers || {}) }, ...options });
  if (response.status === 204) return null;
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result?.error?.code || `REQUEST_FAILED`);
  return result.data;
};
const apiRequestWithRetry = async (url, options = {}, attempts = 2) => {
  let lastError;
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try { return await apiRequest(url, options); }
    catch (error) {
      lastError = error;
      if (attempt + 1 < attempts) await new Promise((resolve) => setTimeout(resolve, 350));
    }
  }
  throw lastError;
};

function DatabaseLearnerManagement({ onSelect }) {
  const emptyUser = { employeeNumber: ``, name: ``, email: ``, organizationId: ``, position: ``, role: `LEARNER`, status: `ACTIVE`, leaderOrganizationIds:[] };
  const [users, setUsers] = r.useState([]), [organizationTree, setOrganizationTree] = r.useState([]);
  const [loading, setLoading] = r.useState(true), [error, setError] = r.useState(``), [query, setQuery] = r.useState(``);
  const [organizationFilter, setOrganizationFilter] = r.useState(``), [statusFilter, setStatusFilter] = r.useState(``);
  const [selectedOrganizationId, setSelectedOrganizationId] = r.useState(``);
  const [expandedOrganizationIds, setExpandedOrganizationIds] = r.useState(() => new Set());
  const [organizationMemberScope, setOrganizationMemberScope] = r.useState(`all`);
  const [organizationMemberPage, setOrganizationMemberPage] = r.useState(1);
  const [userModal, setUserModal] = r.useState(null), [userForm, setUserForm] = r.useState(emptyUser);
  const [organizationModal, setOrganizationModal] = r.useState(false), [organizationForm, setOrganizationForm] = r.useState({ name: ``, parentId: `` });
  const [saving, setSaving] = r.useState(false), importInputRef = r.useRef(null);
  const [archiveStatus, setArchiveStatus] = r.useState(null), [syncingArchive, setSyncingArchive] = r.useState(false);
  const organizations = r.useMemo(() => flattenOrganizationTree(organizationTree), [organizationTree]);
  r.useEffect(() => {
    if (!organizationTree.length) return;
    setExpandedOrganizationIds((current) => current.size ? current : new Set([organizationTree[0].id]));
  }, [organizationTree]);
  const organizationDescendantIds = r.useMemo(() => {
    const result = new Map();
    const visit = (node) => {
      const ids = [node.id, ...(node.children || []).flatMap((child) => visit(child))];
      result.set(node.id, ids);
      return ids;
    };
    organizationTree.forEach(visit);
    const allOrganizationIds = organizations.map((organization) => organization.id);
    organizations
      .filter((organization) => Number(organization.depth) === 0)
      .forEach((organization) => result.set(organization.id, allOrganizationIds));
    return result;
  }, [organizationTree, organizations]);
  const userCountByOrganization = r.useMemo(() => new Map(organizations.map((organization) => {
    if (Number(organization.depth) === 0) return [organization.id, users.length];
    const scope = new Set(organizationDescendantIds.get(organization.id) || [organization.id]);
    return [organization.id, users.filter((user) => scope.has(user.organizationId)).length];
  })), [organizations, organizationDescendantIds, users]);
  const selectedOrganization = organizations.find((organization) => organization.id === selectedOrganizationId) || null;
  const selectedOrganizationSiblings = selectedOrganization ? organizations
    .filter((organization) => organization.parentId === selectedOrganization.parentId)
    .sort((left, right) => (left.sortOrder ?? 0) - (right.sortOrder ?? 0) || left.name.localeCompare(right.name, `ko`)) : [];
  const selectedOrganizationSiblingIndex = selectedOrganization
    ? selectedOrganizationSiblings.findIndex((organization) => organization.id === selectedOrganization.id) : -1;
  const selectedOrganizationIsCorporate = Number(selectedOrganization?.depth) === 0;
  const selectedOrganizationScope = new Set(selectedOrganization ? (organizationDescendantIds.get(selectedOrganization.id) || [selectedOrganization.id]) : []);
  const selectedOrganizationUsers = selectedOrganization
    ? (selectedOrganizationIsCorporate ? users : users.filter((user) => selectedOrganizationScope.has(user.organizationId)))
    : [];
  const directOrganizationUsers = selectedOrganization
    ? users.filter((user) => user.organizationId === selectedOrganization.id)
    : [];
  const visibleOrganizationUsers = organizationMemberScope === `direct` ? directOrganizationUsers : selectedOrganizationUsers;
  const organizationMemberPageSize = 8;
  const organizationMemberPageCount = Math.max(1, Math.ceil(visibleOrganizationUsers.length / organizationMemberPageSize));
  const safeOrganizationMemberPage = Math.min(organizationMemberPage, organizationMemberPageCount);
  const pagedOrganizationUsers = visibleOrganizationUsers.slice(
    (safeOrganizationMemberPage - 1) * organizationMemberPageSize,
    safeOrganizationMemberPage * organizationMemberPageSize,
  );
  r.useEffect(() => {
    setOrganizationMemberScope(`all`);
    setOrganizationMemberPage(1);
  }, [selectedOrganizationId]);
  const load = r.useCallback(async () => {
    setLoading(true); setError(``);
    try {
      const result = await apiRequestWithRetry(`/api/v1/admin/management`);
      setUsers(result.users || []);
      setOrganizationTree(result.organizationTree || []);
      setArchiveStatus(result.archiveStatus || { configured: false, unavailable: true, latest: null });
    } catch (managementError) {
      const [userResult, organizationResult] = await Promise.allSettled([
        apiRequestWithRetry(`/api/v1/admin/users`), apiRequestWithRetry(`/api/v1/admin/organizations/tree`),
      ]);
      if (userResult.status === `fulfilled`) setUsers(userResult.value);
      if (organizationResult.status === `fulfilled`) setOrganizationTree(organizationResult.value);
      const failed = [];
      if (userResult.status === `rejected`) failed.push(`사용자(${userResult.reason?.message || `요청 실패`})`);
      if (organizationResult.status === `rejected`) failed.push(`조직(${organizationResult.reason?.message || `요청 실패`})`);
      if (failed.length) setError(`${failed.join(` · `)} 정보를 불러오지 못했습니다.`);
      try { setArchiveStatus(await apiRequest(`/api/v1/admin/archive/status`)); }
      catch { setArchiveStatus({ configured: false, unavailable: true, latest: null }); }
    } finally { setLoading(false); }
  }, []);
  r.useEffect(() => { load(); }, [load]);
  const filteredUsers = users.filter((user) => {
    const keyword = query.trim().toLowerCase();
    const filterOrganization = organizations.find((organization) => organization.id === organizationFilter);
    const matchesOrganization = !organizationFilter
      || Number(filterOrganization?.depth) === 0
      || new Set(organizationDescendantIds.get(organizationFilter) || [organizationFilter]).has(user.organizationId);
    return (!keyword || `${user.name} ${user.employeeNumber} ${user.email} ${user.organizationName || ``}`.toLowerCase().includes(keyword))
      && matchesOrganization && (!statusFilter || user.status === statusFilter);
  });
  const openCreate = () => { setUserForm(emptyUser); setUserModal({ mode: `create` }); };
  const openEdit = async (user) => { let scopes=[];try{scopes=await apiRequest(`/api/v1/admin/users/${user.id}/leader-scopes`);}catch{} setUserForm({ ...user, organizationId: user.organizationId || ``, position: user.position || ``, leaderOrganizationIds:scopes.map((scope)=>scope.organizationId) }); setUserModal({ mode: `edit`, id: user.id }); };
  const saveUser = async () => {
    if (!userForm.employeeNumber.trim() || !userForm.name.trim() || !userForm.email.trim().endsWith(`@sparkplus.co`)) return setError(`사번, 이름, 회사 이메일을 확인해주세요.`);
    setSaving(true); setError(``);
    try {
      const payload = { ...userForm, organizationId: userForm.organizationId || null, position: userForm.position || null };
      await apiRequest(userModal.mode === `create` ? `/api/v1/admin/users` : `/api/v1/admin/users/${userModal.id}`, {
        method: userModal.mode === `create` ? `POST` : `PATCH`, body: JSON.stringify(payload),
      });
      if(userModal.mode === `edit`) await apiRequest(`/api/v1/admin/users/${userModal.id}/leader-scopes`,{method:`PUT`,body:JSON.stringify({organizationIds:userForm.leaderOrganizationIds || []})});
      setUserModal(null); await load(); showAdminToast(userModal.mode === `create` ? `사용자가 등록되었습니다.` : `사용자 정보가 수정되었습니다.`);
    } catch (requestError) { setError(requestError.message === `USER_ALREADY_EXISTS` ? `이미 등록된 사번 또는 이메일입니다.` : `사용자 정보를 저장하지 못했습니다.`); }
    finally { setSaving(false); }
  };
  const changeStatus = async (user) => {
    try { await apiRequest(`/api/v1/admin/users/${user.id}`, { method: `PATCH`, body: JSON.stringify({ status: user.status === `ACTIVE` ? `INACTIVE` : `ACTIVE` }) }); await load(); }
    catch { setError(`계정 상태를 변경하지 못했습니다.`); }
  };
  const deleteUser = async (user) => {
    if (!window.confirm(`${user.name} 사용자를 삭제하시겠습니까?`)) return;
    try { await apiRequest(`/api/v1/admin/users/${user.id}`, { method: `DELETE` }); await load(); showAdminToast(`사용자가 삭제되었습니다.`); }
    catch (requestError) { setError(requestError.message === `CANNOT_DELETE_SELF` ? `현재 로그인한 관리자 계정은 삭제할 수 없습니다.` : `사용자를 삭제하지 못했습니다.`); }
  };
  const saveOrganization = async () => {
    if (!organizationForm.name.trim()) return;
    setSaving(true); setError(``);
    try {
      await apiRequest(`/api/v1/admin/organizations`, { method: `POST`, body: JSON.stringify({ name: organizationForm.name, parentId: organizationForm.parentId || null }) });
      setOrganizationModal(false); setOrganizationForm({ name: ``, parentId: `` }); await load(); showAdminToast(`조직이 등록되었습니다.`);
    } catch (requestError) { setError(requestError.message === `ORGANIZATION_DEPTH_EXCEEDED` ? `조직은 최대 3단계까지만 만들 수 있습니다.` : `조직을 등록하지 못했습니다.`); }
    finally { setSaving(false); }
  };
  const toggleOrganization = async (organization) => {
    try { await apiRequest(`/api/v1/admin/organizations/${organization.id}`, { method: `PATCH`, body: JSON.stringify({ status: organization.status === `ACTIVE` ? `INACTIVE` : `ACTIVE` }) }); await load(); }
    catch { setError(`조직 상태를 변경하지 못했습니다.`); }
  };
  const promoteCorporation = async (organization) => {
    if (!window.confirm(`${organization.name}을(를) 최상위 0단계 법인으로 설정하시겠습니까?`)) return;
    try { await apiRequest(`/api/v1/admin/organizations/${organization.id}/promote-corporation`, { method: `POST` }); await load(); showAdminToast(`${organization.name}이(가) 0단계 법인으로 설정되었습니다.`); }
    catch (error) { alert(error?.message || `최상위 법인 설정에 실패했습니다.`); }
  };
  const deleteOrganization = async (organization) => {
    if (!window.confirm(`${organization.name} 조직을 삭제하시겠습니까?\n\n하위 조직, 소속 사용자 또는 과정 배정이 남아 있으면 삭제되지 않습니다.`)) return;
    setError(``);
    try {
      await apiRequest(`/api/v1/admin/organizations/${organization.id}`, { method: `DELETE` });
      setSelectedOrganizationId(``); setOrganizationFilter(``); await load(); showAdminToast(`조직이 삭제되었습니다.`);
    } catch (requestError) {
      setError(requestError.message === `ORGANIZATION_DELETE_BLOCKED`
        ? `하위 조직, 소속 사용자 또는 과정 배정이 남아 있어 삭제할 수 없습니다. 먼저 해당 연결을 정리해주세요.`
        : `조직을 삭제하지 못했습니다.`);
    }
  };
  const reorderOrganization = async (direction) => {
    if (!selectedOrganization) return;
    setError(``);
    try {
      await apiRequest(`/api/v1/admin/organizations/${selectedOrganization.id}/reorder`, {
        method: `POST`, body: JSON.stringify({ direction }),
      });
      await load(); showAdminToast(`조직 순서가 변경되었습니다.`);
    } catch { setError(`조직 순서를 변경하지 못했습니다.`); }
  };
  const downloadTemplate = () => {
    const samplePath = organizations.find((item) => item.status === `ACTIVE`)?.pathLabel || `개발본부 > 부동산팀 > 개발파트`;
    const csv = `사번,이름,이메일,조직경로,직책,권한,상태\nSP1001,홍길동,hong.gildong@sparkplus.co,"${samplePath}",매니저,LEARNER,ACTIVE\n`;
    const blob = new Blob([`\ufeff${csv}`], { type: `text/csv;charset=utf-8` }); const url = URL.createObjectURL(blob);
    const anchor = document.createElement(`a`); anchor.href = url; anchor.download = `SPARKPLUS_LMS_사용자등록양식.csv`; anchor.click(); URL.revokeObjectURL(url);
  };
  const importCsv = async (event) => {
    const file = event.target.files?.[0]; event.target.value = ``; if (!file) return;
    try {
      const lines = (await file.text()).replace(/^\ufeff/, ``).split(/\r?\n/).filter(Boolean); const headers = parseCsvLine(lines[0]);
      const expected = [`사번`, `이름`, `이메일`, `조직경로`, `직책`, `권한`, `상태`];
      if (expected.some((header, index) => headers[index] !== header)) throw new Error(`INVALID_HEADERS`);
      const rows = lines.slice(1).map((line) => { const cells = parseCsvLine(line); return {
        employeeNumber: cells[0], name: cells[1], email: cells[2], organizationPath: cells[3], position: cells[4] || ``,
        role: cells[5] || `LEARNER`, status: cells[6] || `ACTIVE`,
      }; });
      const result = await apiRequest(`/api/v1/admin/users/import`, { method: `POST`, body: JSON.stringify({ rows }) });
      await load(); showAdminToast(`${result.imported}명의 사용자가 일괄 등록되었습니다.`);
    } catch (requestError) { setError(requestError.message === `IMPORT_VALIDATION_FAILED` ? `파일의 중복값 또는 조직경로를 확인해주세요.` : `CSV 양식과 입력값을 확인해주세요.`); }
  };
  const syncGoogleArchive = async () => {
    setSyncingArchive(true); setError(``);
    try {
      const result = await apiRequest(`/api/v1/admin/archive/sync`, { method: `POST` });
      setArchiveStatus({ configured: true, latest: { action: `GOOGLE_ARCHIVE_SYNCED`, afterData: result, createdAt: result.syncedAt } });
      showAdminToast(`Google 운영대장에 사용자 ${result.counts.users}명과 조직 ${result.counts.organizations}개를 동기화했습니다.`);
    } catch (requestError) {
      const archiveErrors = {
        GOOGLE_ARCHIVE_NOT_CONFIGURED: `Google 아카이브 환경변수가 아직 적용되지 않았습니다.`,
        FORBIDDEN_ROLE: `관리자 권한이 확인되지 않아 동기화를 실행하지 못했습니다. 다시 로그인한 후 시도해주세요.`,
        UNAUTHENTICATED: `로그인 세션이 만료되었습니다. 다시 로그인한 후 시도해주세요.`,
      };
      setError(archiveErrors[requestError.message] || `Google Sheets/Drive 동기화에 실패했습니다. 공유 권한과 문서 ID를 확인해주세요. (${requestError.message})`);
    } finally { setSyncingArchive(false); }
  };
  return <section className="database-learner-management">
    <div className="database-management-toolbar">
      <div><h2>사용자 및 조직 관리</h2><p>Google 로그인 전에 사용자를 등록하고 3단계 조직을 관리합니다.</p></div>
      <div className="database-management-actions">
        <button className="secondary archive-sync-button" disabled={syncingArchive || archiveStatus?.configured === false} onClick={syncGoogleArchive}><Icon icon={RefreshIcon} size={16} />{syncingArchive ? `동기화 중` : `Google 운영대장 동기화`}</button>
        <button className="secondary" onClick={downloadTemplate}><Icon icon={Download01Icon} size={16} />양식 다운로드</button>
        <input ref={importInputRef} type="file" accept=".csv,text/csv" hidden onChange={importCsv} />
        <button className="secondary" onClick={() => importInputRef.current?.click()}><Icon icon={File01Icon} size={16} />Excel/CSV 일괄 등록</button>
        <button className="secondary" onClick={() => setOrganizationModal(true)}><Icon icon={Add01Icon} size={16} />조직 등록</button>
        <button className="primary" onClick={openCreate}><Icon icon={Add01Icon} size={16} />사용자 등록</button>
      </div>
    </div>
    {error && <div className="database-management-error">{error}<div><button onClick={load}>다시 불러오기</button><button onClick={() => setError(``)}>닫기</button></div></div>}
    <div className={`archive-sync-panel ${archiveStatus?.configured ? `configured` : `not-configured`}`}>
      <Icon icon={archiveStatus?.latest?.action === `GOOGLE_ARCHIVE_SYNCED` ? CheckmarkCircle02Icon : RefreshIcon} size={19} />
      <div><b>{archiveStatus?.configured ? `Google Drive · Sheets 연결 준비 완료` : `Google 아카이브 연결 설정 필요`}</b>
        <span>{archiveStatus?.latest?.action === `GOOGLE_ARCHIVE_SYNCED` ? `최근 동기화: ${new Date(archiveStatus.latest.createdAt).toLocaleString(`ko-KR`)}` : `동기화 버튼을 눌러 서비스 계정 접근 권한과 운영대장을 확인하세요.`}</span></div>
    </div>
    <section className="organization-explorer">
      <header><div><h3>조직도</h3><p>조직을 펼치고 선택하면 소속 구성원을 확인할 수 있습니다.</p></div><span>총 {organizations.length}개 조직 · {users.length}명</span></header>
      {organizations.length ? <div className="organization-explorer-body">
        <div className="organization-tree-panel">
          <button type="button" className={!selectedOrganizationId ? `organization-all selected` : `organization-all`} onClick={() => { setSelectedOrganizationId(``); setOrganizationFilter(``); }}><span><Icon icon={UserGroupIcon} size={17} />전체 조직</span><b>{users.length}명</b></button>
          <div className="organization-tree-scroll">{organizationTree.map((node) => <OrganizationTreeNode key={node.id} node={node} selectedId={selectedOrganizationId} expandedIds={expandedOrganizationIds} userCountByOrganization={userCountByOrganization} onSelect={(id) => { setSelectedOrganizationId(id); setOrganizationFilter(id); }} onToggle={(id) => setExpandedOrganizationIds((current) => { const next = new Set(current); next.has(id) ? next.delete(id) : next.add(id); return next; })} />)}</div>
        </div>
        <div className="organization-member-panel">
          {selectedOrganization ? <><div className="organization-member-head"><div><span>{Number(selectedOrganization.depth) === 0 ? `0단계 법인` : `${selectedOrganization.depth}단계 조직`}</span><h3>{selectedOrganization.name}</h3><p>{selectedOrganization.pathLabel}</p></div><div className="organization-member-actions">{!selectedOrganization.parentId && Number(selectedOrganization.depth) !== 0 && <button type="button" className="corporation-promote" onClick={() => promoteCorporation(selectedOrganization)}>0단계 법인 설정</button>}<button type="button" disabled={selectedOrganizationSiblingIndex <= 0} onClick={() => reorderOrganization(`UP`)}>위로</button><button type="button" disabled={selectedOrganizationSiblingIndex < 0 || selectedOrganizationSiblingIndex >= selectedOrganizationSiblings.length - 1} onClick={() => reorderOrganization(`DOWN`)}>아래로</button><button type="button" className={selectedOrganization.status === `ACTIVE` ? `active` : ``} onClick={() => toggleOrganization(selectedOrganization)}>{selectedOrganization.status === `ACTIVE` ? `사용 중` : `비활성`}</button><button type="button" className="danger" onClick={() => deleteOrganization(selectedOrganization)}>조직 삭제</button></div></div>
            <div className="organization-member-summary">
              <button type="button" className={organizationMemberScope === `all` ? `selected` : ``} onClick={() => { setOrganizationMemberScope(`all`); setOrganizationMemberPage(1); }}><span>소속 구성원</span><b>{selectedOrganizationUsers.length}명</b><small>하위 조직 포함</small></button>
              <button type="button" className={organizationMemberScope === `direct` ? `selected` : ``} onClick={() => { setOrganizationMemberScope(`direct`); setOrganizationMemberPage(1); }}><span>직속 구성원</span><b>{directOrganizationUsers.length}명</b><small>이 조직에 직접 소속</small></button>
              <div><span>하위 조직</span><b>{Math.max(0, selectedOrganizationScope.size - 1)}개</b><small>조직 범위</small></div>
            </div>
            <div className="organization-member-list">
              {pagedOrganizationUsers.map((user) => <article key={user.id}><span>{user.name?.[0] || `?`}</span><div><b>{user.name}</b><small>{user.position || `직책 미지정`} · {user.employeeNumber}</small></div><em className={user.status === `ACTIVE` ? `active` : ``}>{user.status === `ACTIVE` ? `활성` : `비활성`}</em></article>)}
              {visibleOrganizationUsers.length === 0 && <p>{organizationMemberScope === `direct` ? `이 조직에 직접 소속된 구성원이 없습니다.` : `이 조직 범위에 등록된 구성원이 없습니다.`}</p>}
              {visibleOrganizationUsers.length > 0 && <div className="organization-member-pagination"><span>{organizationMemberScope === `direct` ? `직속 구성원` : `소속 구성원`} 총 {visibleOrganizationUsers.length}명 · {safeOrganizationMemberPage}/{organizationMemberPageCount} 페이지</span><div><button type="button" disabled={safeOrganizationMemberPage <= 1} onClick={() => setOrganizationMemberPage((page) => Math.max(1, page - 1))} aria-label="이전 구성원 페이지"><Icon icon={ArrowLeft01Icon} size={15} /></button><button type="button" disabled={safeOrganizationMemberPage >= organizationMemberPageCount} onClick={() => setOrganizationMemberPage((page) => Math.min(organizationMemberPageCount, page + 1))} aria-label="다음 구성원 페이지"><Icon icon={ArrowRight01Icon} size={15} /></button></div></div>}
            </div>
          </> : <div className="organization-empty-selection"><span><Icon icon={UserGroupIcon} size={24} /></span><h3>조직을 선택해주세요</h3><p>왼쪽 조직도에서 조직을 누르면 소속 구성원이 이곳에 표시됩니다.</p></div>}
        </div>
      </div> : <p className="organization-explorer-empty">등록된 조직이 없습니다. 먼저 조직을 등록해주세요.</p>}
    </section>
    <SearchFilterPanel value={query} onValueChange={setQuery} placeholder="이름, 사번, 이메일 검색" filters={[
      { label: `조직`, value: organizationFilter, onChange: (value) => { setOrganizationFilter(value); setSelectedOrganizationId(value); }, options: [{ value: ``, label: `전체 조직` }, ...organizations.map((item) => ({ value: item.id, label: item.pathLabel }))] },
      { label: `계정 상태`, value: statusFilter, onChange: setStatusFilter, options: [{ value: ``, label: `전체 상태` }, { value: `ACTIVE`, label: `활성` }, { value: `INACTIVE`, label: `비활성` }] },
    ]} onSearch={() => {}} onReset={() => { setQuery(``); setOrganizationFilter(``); setSelectedOrganizationId(``); setStatusFilter(``); }} />
    <div className="table-wrap learner-table database-user-table"><table><thead><tr><th>사용자</th><th>조직</th><th>직책</th><th>권한</th><th>상태</th><th>관리</th></tr></thead><tbody>
      {filteredUsers.map((user) => <tr key={user.id}><td><div className="person"><span>{user.name[0]}</span><div><b>{user.name}</b><small>{user.employeeNumber} · {user.email}</small></div></div></td>
        <td>{user.organizationName || `미지정`}</td><td>{user.position || `미지정`}</td><td>{user.role === `ADMIN` ? `관리자` : `학습자`}</td>
        <td><span className={`learner-account-status ${user.status === `ACTIVE` ? `active` : `inactive`}`}>{user.status === `ACTIVE` ? `활성` : `비활성`}</span></td>
        <td><div className="database-row-actions"><button onClick={() => onSelect?.({ ...user, userId:user.id, id:user.employeeNumber, dept:user.organizationName || `소속 미지정`, courses:0, completed:0, progress:0 })}>상세</button><button onClick={() => openEdit(user)}>수정</button><button onClick={() => changeStatus(user)}>{user.status === `ACTIVE` ? `비활성화` : `활성화`}</button><button className="danger" onClick={() => deleteUser(user)}>삭제</button></div></td></tr>)}
    </tbody></table>{!loading && !error && !filteredUsers.length && <div className="learner-management-empty">등록된 사용자가 없습니다.</div>}{!loading && error && !filteredUsers.length && <div className="learner-management-empty">데이터 조회에 실패했습니다. 위의 ‘다시 불러오기’를 눌러주세요.</div>}{loading && <div className="learner-management-empty">데이터를 불러오고 있습니다.</div>}</div>
    {userModal && <div className="overlay center" onMouseDown={() => setUserModal(null)}><section className="learner-registration-modal database-modal" onMouseDown={(event) => event.stopPropagation()}><header><div><h2>{userModal.mode === `create` ? `사용자 등록` : `사용자 수정`}</h2><p>@sparkplus.co Google 계정과 연결될 정보를 입력합니다.</p></div><button onClick={() => setUserModal(null)}><Icon icon={Cancel01Icon} /></button></header><div className="learner-registration-form">
      <label><span>사번 *</span><input value={userForm.employeeNumber} onChange={(event) => setUserForm({ ...userForm, employeeNumber: event.target.value })} /></label>
      <label><span>이름 *</span><input value={userForm.name} onChange={(event) => setUserForm({ ...userForm, name: event.target.value })} /></label>
      <label className="learner-registration-wide"><span>회사 이메일 *</span><input type="email" value={userForm.email} onChange={(event) => setUserForm({ ...userForm, email: event.target.value })} placeholder="name@sparkplus.co" /></label>
      <label><span>조직</span><select value={userForm.organizationId} onChange={(event) => setUserForm({ ...userForm, organizationId: event.target.value })}><option value="">미지정</option>{organizations.filter((item) => item.status === `ACTIVE`).map((item) => <option key={item.id} value={item.id}>{item.pathLabel}</option>)}</select></label>
      <label><span>직책</span><input value={userForm.position} onChange={(event) => setUserForm({ ...userForm, position: event.target.value })} placeholder="매니저" /></label>
      <label><span>권한</span><select value={userForm.role} onChange={(event) => setUserForm({ ...userForm, role: event.target.value })}><option value="LEARNER">학습자</option><option value="ADMIN">관리자</option></select></label>
      <label><span>상태</span><select value={userForm.status} onChange={(event) => setUserForm({ ...userForm, status: event.target.value })}><option value="ACTIVE">활성</option><option value="INACTIVE">비활성</option></select></label>
      {userModal.mode === `edit` && <fieldset className="learner-registration-wide leader-scope-field"><legend>조직 리더 권한 (선택)</legend><p>선택한 조직과 하위 조직 구성원의 학습 현황을 볼 수 있습니다.</p>{organizations.filter((item)=>item.status===`ACTIVE`).map((item)=><label key={item.id}><input type="checkbox" checked={(userForm.leaderOrganizationIds||[]).includes(item.id)} onChange={()=>setUserForm({...userForm,leaderOrganizationIds:(userForm.leaderOrganizationIds||[]).includes(item.id)?userForm.leaderOrganizationIds.filter((id)=>id!==item.id):[...(userForm.leaderOrganizationIds||[]),item.id]})}/><span>{item.pathLabel}</span></label>)}</fieldset>}
    </div><footer><button className="secondary" onClick={() => setUserModal(null)}>취소</button><button className="primary" disabled={saving} onClick={saveUser}>{saving ? `저장 중` : `저장`}</button></footer></section></div>}
    {organizationModal && <div className="overlay center" onMouseDown={() => setOrganizationModal(false)}><section className="learner-registration-modal database-modal compact" onMouseDown={(event) => event.stopPropagation()}><header><div><h2>조직 등록</h2><p>0단계 법인 아래에 1단계 본부부터 최대 3단계 조직까지 구성합니다.</p></div><button onClick={() => setOrganizationModal(false)}><Icon icon={Cancel01Icon} /></button></header><div className="learner-registration-form">
      <label className="learner-registration-wide"><span>조직명 *</span><input value={organizationForm.name} onChange={(event) => setOrganizationForm({ ...organizationForm, name: event.target.value })} placeholder="개발본부" /></label>
      <label className="learner-registration-wide"><span>상위 조직</span><select value={organizationForm.parentId} onChange={(event) => setOrganizationForm({ ...organizationForm, parentId: event.target.value })}><option value="">최상위 법인(0단계)</option>{organizations.filter((item) => item.depth < 3 && item.status === `ACTIVE`).map((item) => <option key={item.id} value={item.id}>{item.pathLabel} ({item.depth}단계)</option>)}</select></label>
    </div><footer><button className="secondary" onClick={() => setOrganizationModal(false)}>취소</button><button className="primary" disabled={saving || !organizationForm.name.trim()} onClick={saveOrganization}>등록</button></footer></section></div>}
  </section>;
}

function LearnerDepartmentHub({ onSelect }) {
  const departmentMeta = [
    {
      name: `People팀`,
      icon: UserGroupIcon,
      tone: `blue`,
      members: 24,
      progress: 84,
      completion: 78,
      required: 3,
    },
    {
      name: `개발팀`,
      icon: Analytics01Icon,
      tone: `violet`,
      members: 54,
      progress: 76,
      completion: 69,
      required: 8,
    },
    {
      name: `마케팅팀`,
      icon: ChartHistogramIcon,
      tone: `coral`,
      members: 38,
      progress: 88,
      completion: 83,
      required: 4,
    },
    {
      name: `세일즈팀`,
      icon: RankingIcon,
      tone: `green`,
      members: 46,
      progress: 71,
      completion: 65,
      required: 11,
    },
    {
      name: `운영팀`,
      icon: Settings02Icon,
      tone: `amber`,
      members: 57,
      progress: 81,
      completion: 75,
      required: 7,
    },
    {
      name: `공간디자인팀`,
      icon: File01Icon,
      tone: `sky`,
      members: 29,
      progress: 79,
      completion: 72,
      required: 5,
    },
  ];
  const names = [
    `김수민`,
    `이지은`,
    `박서준`,
    `최하늘`,
    `정유진`,
    `김도윤`,
    `윤서아`,
    `오지훈`,
    `한가람`,
    `서민재`,
    `조하은`,
    `송현우`,
    `강지수`,
    `백승민`,
    `임채원`,
    `문태영`,
    `장예린`,
    `고은호`,
    `유다인`,
    `신재욱`,
    `배서윤`,
    `노준호`,
    `홍예진`,
    `안도현`,
  ];
  const positions = [`인턴`, `매니저`, `팀장`, `파트장`];
  const [employees, setEmployees] = r.useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(`sparkplus-managed-learners`));
      if (Array.isArray(stored) && stored.length) return stored;
    } catch {}
    return names.map((name, index) => {
    const dept = departmentMeta[index % departmentMeta.length].name;
    const progress = 48 + ((index * 13) % 51);
    const courses = 3 + (index % 5);
    const id = `SP${String(1024 + index).padStart(4, `0`)}`;
    return {
      id,
      name,
      email: `${id.toLowerCase()}@sparkplus.co`,
      dept,
      position: positions[index % positions.length],
      courses,
      progress,
      completed: Math.min(courses, Math.floor(progress / 20)),
      status: `재직`,
      learningStatus:
        progress >= 85 ? `수료` : progress < 60 ? `관리 필요` : `수강 중`,
    };
    });
  });
  r.useEffect(() => {
    localStorage.setItem(`sparkplus-managed-learners`, JSON.stringify(employees));
  }, [employees]);
  const [selectedDept, setSelectedDept] = r.useState(null);
  const [query, setQuery] = r.useState(``);
  const [department, setDepartment] = r.useState(`전체 부서`);
  const [position, setPosition] = r.useState(`전체 직급`);
  const [learningStatus, setLearningStatus] = r.useState(`전체 학습 상태`);
  const [registrationOpen, setRegistrationOpen] = r.useState(false);
  const [registrationTouched, setRegistrationTouched] = r.useState({});
  const [learnerForm, setLearnerForm] = r.useState({
    name: ``,
    id: ``,
    email: ``,
    dept: ``,
    position: ``,
  });
  const normalizedId = learnerForm.id.trim().toUpperCase();
  const normalizedEmail = learnerForm.email.trim().toLowerCase();
  const registrationErrors = {
    name: learnerForm.name.trim() ? `` : `이름을 입력해주세요.`,
    id: !normalizedId
      ? `사번을 입력해주세요.`
      : employees.some((employee) => employee.id.toUpperCase() === normalizedId)
        ? `이미 등록된 사번입니다.`
        : ``,
    email: !normalizedEmail
      ? `이메일을 입력해주세요.`
      : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)
        ? `올바른 이메일 형식으로 입력해주세요.`
        : employees.some((employee) => employee.email?.toLowerCase() === normalizedEmail)
          ? `이미 등록된 이메일입니다.`
          : ``,
    dept: learnerForm.dept ? `` : `부서를 선택해주세요.`,
    position: learnerForm.position ? `` : `직급을 선택해주세요.`,
  };
  const canRegisterLearner = Object.values(registrationErrors).every((error) => !error);
  const updateLearnerForm = (field, value) => {
    setLearnerForm((current) => ({ ...current, [field]: value }));
  };
  const closeLearnerRegistration = () => {
    setRegistrationOpen(false);
    setRegistrationTouched({});
    setLearnerForm({ name: ``, id: ``, email: ``, dept: ``, position: `` });
  };
  const registerLearner = () => {
    setRegistrationTouched({ name: true, id: true, email: true, dept: true, position: true });
    if (!canRegisterLearner) return;
    setEmployees((current) => [
      ...current,
      {
        id: normalizedId,
        name: learnerForm.name.trim(),
        email: normalizedEmail,
        dept: learnerForm.dept,
        position: learnerForm.position,
        courses: 0,
        progress: 0,
        completed: 0,
        status: `재직`,
        learningStatus: `미수강`,
      },
    ]);
    setQuery(``);
    setDepartment(`전체 부서`);
    setPosition(`전체 직급`);
    setLearningStatus(`전체 학습 상태`);
    setSelectedDept(null);
    closeLearnerRegistration();
    showAdminToast(`학습자가 등록되었습니다.`);
  };
  const activeDepartment = selectedDept || department;
  const departmentDisplayMeta = departmentMeta.map((item) => ({
    ...item,
    members: employees.filter((employee) => employee.dept === item.name).length,
  }));
  const filteredEmployees = employees.filter(
    (employee) =>
      (!query ||
        employee.name.includes(query) ||
        employee.dept.includes(query) ||
        employee.id.toLowerCase().includes(query.toLowerCase())) &&
      (activeDepartment === `전체 부서` ||
        employee.dept === activeDepartment) &&
      (position === `전체 직급` || employee.position === position) &&
      (learningStatus === `전체 학습 상태` ||
        employee.learningStatus === learningStatus),
  );
  const resetFilters = () => {
    setQuery(``);
    setDepartment(`전체 부서`);
    setPosition(`전체 직급`);
    setLearningStatus(`전체 학습 상태`);
    setSelectedDept(null);
  };

  return (
    <section className="department-hub learner-management-hub">
      <SearchFilterPanel
        value={query}
        onValueChange={setQuery}
        placeholder="이름 또는 부서 검색"
        filters={[
          { label: `부서`, value: department, onChange: (value) => { setDepartment(value); setSelectedDept(null); }, options: [`전체 부서`, ...departmentMeta.map((dept) => dept.name)] },
          { label: `직급`, value: position, onChange: setPosition, options: [`전체 직급`, `인턴`, `사원`, `매니저`, `파트장`, `팀장`] },
          { label: `학습 상태`, value: learningStatus, onChange: setLearningStatus, options: [`전체 학습 상태`, `관리 필요`, `수강 중`, `수료`] },
        ]}
        onSearch={() => {}}
        onReset={resetFilters}
      />

      <div className="department-hub-intro learner-department-head">
        <div>
          <h2>부서별 학습 현황</h2>
          <p>부서별 학습 현황을 확인하고 소속 학습자를 관리할 수 있습니다.</p>
        </div>
      </div>

      <div className="department-card-grid learner-department-grid">
        {departmentDisplayMeta.map((dept) => (
          <button
            className={`department-card learner-department-card ${selectedDept === dept.name ? `selected` : ``}`}
            key={dept.name}
            onClick={() => {
              setSelectedDept(dept.name);
              setDepartment(`전체 부서`);
            }}
          >
            <div className="learner-department-card-top">
              <div className={`department-icon ${dept.tone}`}>
                <Icon icon={dept.icon} size={19} />
              </div>
              <div className="department-card-title">
                <h3>{dept.name}</h3>
                <span>{dept.members}명</span>
              </div>
            </div>
            <div className="learner-department-metrics">
              <div>
                <small>평균 진도율</small>
                <b>{dept.progress}%</b>
                <span className="department-metric-bar progress"><i style={{ width: `${dept.progress}%` }} /></span>
              </div>
              <div className="completion-rate">
                <small>평균 수료율</small>
                <b>{dept.completion}%</b>
                <span className="department-metric-bar completion"><i style={{ width: `${dept.completion}%` }} /></span>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="learner-list-head">
        <div>
          <h2>{selectedDept ? `${selectedDept} 학습자` : `전체 학습자`}</h2>
          <span>{filteredEmployees.length}명</span>
        </div>
        <div className="learner-list-actions">
          {selectedDept && (
            <button className="learner-view-all" onClick={() => setSelectedDept(null)}>전체 보기</button>
          )}
          <button className="primary learner-register-trigger" onClick={() => setRegistrationOpen(true)}>
            <Icon icon={Add01Icon} size={16} />
            학습자 등록
          </button>
        </div>
      </div>

      <div className="table-wrap learner-table learner-management-table">
        <table>
          <thead>
            <tr>
              <th>이름</th>
              <th>부서</th>
              <th>직급</th>
              <th>계정 상태</th>
              <th>수강 중 과정</th>
              <th>평균 진도율</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((employee) => (
              <tr key={employee.id}>
                <td>
                  <div className="person">
                    <span>{employee.name[0]}</span>
                    <div>
                      <b>{employee.name}</b>
                      <small>{employee.id}</small>
                    </div>
                  </div>
                </td>
                <td><span className="learner-soft-tag department">{employee.dept}</span></td>
                <td><span className="learner-soft-tag position">{employee.position}</span></td>
                <td><span className={`learner-account-status ${employee.status === `비활성` ? `inactive` : `active`}`}>{employee.status === `비활성` ? `비활성` : `활성`}</span></td>
                <td>{Math.max(0, employee.courses - employee.completed)}개</td>
                <td>
                  <div className="table-progress">
                    {d({ value: employee.progress })}
                    <span>{employee.progress}%</span>
                  </div>
                  {employee.learningStatus === `관리 필요` && <small className="learner-attention-inline">주의 필요</small>}
                </td>
                <td>
                  <button className="detail" onClick={() => onSelect(employee)}>
                    자세히 보기
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {filteredEmployees.length === 0 && (
        <div className="learner-management-empty">
          조건에 맞는 학습자가 없습니다.
        </div>
      )}
      {registrationOpen && (
        <div className="overlay center learner-registration-overlay" onMouseDown={closeLearnerRegistration}>
          <section className="learner-registration-modal" role="dialog" aria-modal="true" aria-labelledby="learner-registration-title" onMouseDown={(event) => event.stopPropagation()}>
            <header>
              <div>
                <h2 id="learner-registration-title">학습자 등록</h2>
                <p>LMS를 이용할 학습자 정보를 입력해주세요.</p>
              </div>
              <button type="button" className="learner-registration-close" onClick={closeLearnerRegistration} aria-label="닫기">
                <Icon icon={Cancel01Icon} size={19} />
              </button>
            </header>
            <div className="learner-registration-form">
              <label>
                <span>이름 <b>*</b></span>
                <input value={learnerForm.name} onChange={(event) => updateLearnerForm(`name`, event.target.value)} onBlur={() => setRegistrationTouched((current) => ({ ...current, name: true }))} placeholder="김수민" autoFocus />
                {registrationTouched.name && registrationErrors.name && <small>{registrationErrors.name}</small>}
              </label>
              <label>
                <span>사번 <b>*</b></span>
                <input value={learnerForm.id} onChange={(event) => updateLearnerForm(`id`, event.target.value)} onBlur={() => setRegistrationTouched((current) => ({ ...current, id: true }))} placeholder="SP1024" />
                {learnerForm.id && registrationErrors.id && <small>{registrationErrors.id}</small>}
                {!learnerForm.id && registrationTouched.id && <small>{registrationErrors.id}</small>}
              </label>
              <label className="learner-registration-wide">
                <span>이메일 <b>*</b></span>
                <input type="email" value={learnerForm.email} onChange={(event) => updateLearnerForm(`email`, event.target.value)} onBlur={() => setRegistrationTouched((current) => ({ ...current, email: true }))} placeholder="example@sparkplus.co" />
                {learnerForm.email && registrationErrors.email && <small>{registrationErrors.email}</small>}
                {!learnerForm.email && registrationTouched.email && <small>{registrationErrors.email}</small>}
              </label>
              <label>
                <span>부서 <b>*</b></span>
                <select value={learnerForm.dept} onChange={(event) => updateLearnerForm(`dept`, event.target.value)} onBlur={() => setRegistrationTouched((current) => ({ ...current, dept: true }))}>
                  <option value="">부서 선택</option>
                  {departmentMeta.map((dept) => <option key={dept.name} value={dept.name}>{dept.name}</option>)}
                </select>
                {registrationTouched.dept && registrationErrors.dept && <small>{registrationErrors.dept}</small>}
              </label>
              <label>
                <span>직급 <b>*</b></span>
                <select value={learnerForm.position} onChange={(event) => updateLearnerForm(`position`, event.target.value)} onBlur={() => setRegistrationTouched((current) => ({ ...current, position: true }))}>
                  <option value="">직급 선택</option>
                  {[`인턴`, `사원`, `매니저`, `파트장`, `팀장`].map((value) => <option key={value}>{value}</option>)}
                </select>
                {registrationTouched.position && registrationErrors.position && <small>{registrationErrors.position}</small>}
              </label>
            </div>
            <footer>
              <button type="button" className="secondary" onClick={closeLearnerRegistration}>취소</button>
              <button type="button" className="primary" disabled={!canRegisterLearner} onClick={registerLearner}>학습자 등록</button>
            </footer>
          </section>
        </div>
      )}
    </section>
  );
}

function AdminLearningStatusPage() {
  const initialRange = adminQuickRange(`sixMonths`);
  const [range, setRange] = r.useState(initialRange);
  const [type, setType] = r.useState(`ENROLLED`);
  const [query, setQuery] = r.useState(``);
  const [filters, setFilters] = r.useState({ ...initialRange, type: `ENROLLED`, query: `` });
  const [data, setData] = r.useState({ summary: {}, rows: [] });
  const [loading, setLoading] = r.useState(true);
  const [error, setError] = r.useState(``);
  const [excludeCompleted, setExcludeCompleted] = r.useState(false);
  const [manualCompletion, setManualCompletion] = r.useState(null);
  const [manualReason, setManualReason] = r.useState(``);
  const [manualSubmitting, setManualSubmitting] = r.useState(false);
  const [refreshKey, setRefreshKey] = r.useState(0);
  r.useEffect(() => {
    let active = true;
    setLoading(true); setError(``);
    const params = new URLSearchParams({ start: filters.start, end: filters.end, type: filters.type, query: filters.query });
    apiRequest(`/api/v1/admin/learning-activity?${params}`).then((result) => { if (active) setData(result || { summary: {}, rows: [] }); })
      .catch((requestError) => { if (active) { setData({ summary: {}, rows: [] }); setError(requestError?.message || `학습 현황을 불러오지 못했습니다.`); } })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [filters, refreshKey]);
  const summary = data.summary || {};
  const rows = data.rows || [];
  const visibleRows = filters.type === `ENROLLED` && excludeCompleted
    ? rows.filter((row) => !row.completedAt && row.status !== `COMPLETED`)
    : rows;
  const applyFilters = () => setFilters({ start: range.start, end: range.end, type, query: query.trim() });
  const openManualCompletion = (row) => { setManualCompletion(row); setManualReason(``); };
  const submitManualCompletion = async () => {
    if (!manualCompletion) return;
    setManualSubmitting(true);
    try {
      await apiRequest(`/api/v1/admin/enrollments/${manualCompletion.enrollmentId}/manual-complete`, { method:`POST`, body:JSON.stringify({ reason:manualReason.trim() }) });
      showAdminToast(`${manualCompletion.name}님의 과정이 관리자 수동 수료 처리되었습니다.`);
      setManualCompletion(null); setManualReason(``); setRefreshKey((value) => value + 1);
    } catch (requestError) { showAdminToast(requestError?.message || `수동 수료 처리에 실패했습니다.`, `error`); }
    finally { setManualSubmitting(false); }
  };
  return <section className="learning-status-page">
    <div className="learning-status-toolbar">
      <div className="learning-status-tabs" role="tablist" aria-label="학습 현황 유형">
        <button className={type === `ENROLLED` ? `active` : ``} onClick={() => setType(`ENROLLED`)}>수강 신청</button>
        <button className={type === `COMPLETED` ? `active` : ``} onClick={() => setType(`COMPLETED`)}>학습 완료</button>
      </div>
      <div className="learning-status-dates"><input type="date" onClick={openNativeDatePicker} value={range.start} onChange={(event) => setRange({ ...range, start: event.target.value })} /><span>~</span><input type="date" onClick={openNativeDatePicker} value={range.end} onChange={(event) => setRange({ ...range, end: event.target.value })} /></div>
      <label className="learning-status-search"><Icon icon={Search01Icon} size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => event.key === `Enter` && applyFilters()} placeholder="이름, 사번, 강의명 검색" /></label>
      <button className="primary" onClick={applyFilters}>조회</button>
    </div>
    <div className="learning-status-summary">
      <article><span>수강 신청 건수</span><b>{Number(summary.enrollmentCount || 0).toLocaleString()}건</b><small>{Number(summary.enrolledPeople || 0).toLocaleString()}명</small></article>
      <article><span>학습 완료 건수</span><b>{Number(summary.completionCount || 0).toLocaleString()}건</b><small>{Number(summary.completedPeople || 0).toLocaleString()}명</small></article>
      <article><span>학습 대상 과정</span><b>{Number(summary.courseCount || 0).toLocaleString()}개</b><small>선택 기간 기준</small></article>
      <article><span>지급 리워드</span><b>{Number(summary.rewardPoints || 0).toLocaleString()}P</b><small>동일 기간 DB 기준</small></article>
    </div>
    <div className="learning-status-result-head"><div><div className="learning-status-result-title"><h2>{filters.type === `COMPLETED` ? `학습 완료` : `수강 신청`} 상세</h2>{filters.type === `ENROLLED` && <button type="button" className={excludeCompleted ? `active` : ``} onClick={() => setExcludeCompleted((current) => !current)}><Icon icon={CheckmarkCircle02Icon} size={15} />완료건 제외</button>}</div><p>{filters.start.replaceAll(`-`, `.`)} ~ {filters.end.replaceAll(`-`, `.`)} · 총 {visibleRows.length.toLocaleString()}건{filters.type === `ENROLLED` && excludeCompleted ? ` (완료 제외)` : ``}</p></div><span>관리자 홈·학습 리워드와 동일한 수강/포인트 원천 데이터를 사용합니다.</span></div>
    {error && <div className="inline-error">{error}</div>}
    <div className="table-wrap learning-status-table-wrap"><table className="learning-status-table"><thead><tr><th>학습자</th><th>조직</th><th>교육과정</th><th>구분</th><th>진도/차시</th><th>{filters.type === `COMPLETED` ? `완료일` : `신청일`}</th><th>리워드</th><th>관리</th></tr></thead><tbody>
      {loading && <tr><td colSpan="8" className="table-empty">학습 현황을 불러오고 있습니다.</td></tr>}
      {!loading && !visibleRows.length && <tr><td colSpan="8" className="table-empty">선택한 조건의 학습 기록이 없습니다.</td></tr>}
      {!loading && visibleRows.map((row) => <tr key={row.enrollmentId}><td><b>{row.name}</b><small>{row.employeeNumber} · {row.email}</small></td><td>{row.organization}</td><td><b>{row.course}</b><small>{row.category}</small></td><td><span className={row.required ? `status-chip required` : `status-chip`}>{row.required ? `필수` : `선택`}</span></td><td><b>{Number(row.progress || 0)}%</b><small>{Number(row.completedLessons || 0)}/{Number(row.totalLessons || 0)}차시</small></td><td>{new Date(filters.type === `COMPLETED` ? row.completedAt : row.enrolledAt).toLocaleString(`ko-KR`, { year:`numeric`, month:`2-digit`, day:`2-digit`, hour:`2-digit`, minute:`2-digit` })}</td><td><b>{Number(row.rewardPoints || 0).toLocaleString()}P</b></td><td>{filters.type === `ENROLLED` && row.status !== `COMPLETED` ? <button type="button" className="manual-complete-open" onClick={() => openManualCompletion(row)}>수동 수료</button> : <span className="manual-complete-done">{row.status === `COMPLETED` ? `수료 완료` : `-`}</span>}</td></tr>)}
    </tbody></table></div>
    {manualCompletion && <ResultsDetailModal title="관리자 수동 수료 처리" subtitle={manualCompletion.name} onClose={() => !manualSubmitting && setManualCompletion(null)}>
      <div className="manual-completion-summary"><span>교육과정</span><b>{manualCompletion.course}</b><small>현재 진도 {Number(manualCompletion.progress || 0)}% · {Number(manualCompletion.completedLessons || 0)}/{Number(manualCompletion.totalLessons || 0)}차시 완료</small></div>
      <div className="note warn"><strong>관리자 예외 수료</strong><p>미완료 상태라도 오프라인 이수, 대체교육, 시스템 오류 또는 운영상 승인된 사유가 있으면 관리자가 수료 처리할 수 있습니다. 수료 상태·진도율·리워드·수료증이 즉시 반영되며 처리자와 사유가 감사 기록에 남습니다.</p></div>
      <label className="manual-completion-reason"><span>처리 사유 <small>(선택)</small></span><textarea value={manualReason} onChange={(event) => setManualReason(event.target.value)} maxLength={1000} placeholder="예: 오프라인 대체교육 이수 확인" autoFocus /><small>{manualReason.length}/1000자</small></label>
      <div className="completion-modal-actions"><button type="button" disabled={manualSubmitting} onClick={() => setManualCompletion(null)}>취소</button><button type="button" className="final-process" disabled={manualSubmitting} onClick={submitManualCompletion}>{manualSubmitting ? `처리 중...` : `수동 수료 확정`}</button></div>
    </ResultsDetailModal>}
  </section>;
}

function LearnerProfilePage({ learner, onBack, onUpdate }) {
  const [editOpen, setEditOpen] = r.useState(false);
  const [statusConfirmOpen, setStatusConfirmOpen] = r.useState(false);
  const [editTouched, setEditTouched] = r.useState({});
  const [detail,setDetail]=r.useState(null);
  const userId=learner.userId || learner.id;
  const loadDetail=r.useCallback(()=>apiRequest(`/api/v1/admin/users/${userId}/learning-summary`).then(setDetail).catch(()=>showAdminToast(`학습자 상세 정보를 불러오지 못했습니다.`,`error`)),[userId]);
  r.useEffect(()=>{loadDetail();},[loadDetail]);
  const profileUser=detail?.user || learner;
  const summary=detail?.summary || {courses:0,completed:0,averageProgress:0,badgeCount:0,points:0,requiredTotal:0,requiredCompleted:0};
  const [editForm, setEditForm] = r.useState({ name: learner.name, email: learner.email || ``, position: learner.position || `` });
  const normalizedEditEmail = editForm.email.trim().toLowerCase();
  const editErrors = {
    name: editForm.name.trim() ? `` : `이름을 입력해주세요.`,
    email: !normalizedEditEmail ? `이메일을 입력해주세요.` : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEditEmail) ? `올바른 이메일 형식으로 입력해주세요.` : ``,
    position: editForm.position ? `` : `직급을 선택해주세요.`,
  };
  const canSaveLearner = Object.values(editErrors).every((error) => !error);
  const persistLearner = async (updates) => {
    const saved=await apiRequest(`/api/v1/admin/users/${userId}`,{method:`PATCH`,body:JSON.stringify(updates)});
    const updated={...learner,...saved,userId:saved.id,id:saved.employeeNumber,dept:profileUser.organizationName};
    onUpdate?.(updated);
    await loadDetail();
    return updated;
  };
  const saveLearnerInfo = async () => {
    setEditTouched({ name: true, email: true, position: true });
    if (!canSaveLearner) return;
    try { await persistLearner({ name: editForm.name.trim(), email: normalizedEditEmail, position: editForm.position.trim() }); setEditOpen(false); showAdminToast(`학습자 정보가 수정되었습니다.`); }
    catch { showAdminToast(`학습자 정보를 수정하지 못했습니다.`,`error`); }
  };
  const toggleLearnerStatus = async () => {
    const activating = profileUser.status === `INACTIVE`;
    try { await persistLearner({ status: activating ? `ACTIVE` : `INACTIVE` }); setStatusConfirmOpen(false); showAdminToast(activating ? `계정이 활성화되었습니다.` : `계정이 비활성화되었습니다.`); }
    catch { showAdminToast(`계정 상태를 변경하지 못했습니다.`,`error`); }
  };
  const learningCourses=(detail?.courses || []).map((course)=>({...course,learningProgress:Number(course.progress||0),period:course.startDate&&course.endDate?`${String(course.startDate).slice(0,10).replaceAll(`-`,`.`)} ~ ${String(course.endDate).slice(0,10).replaceAll(`-`,`.`)}`:`기간 미설정`,state:course.status===`COMPLETED`?`수료`:Number(course.progress)>0?`학습 중`:`미수강`,completedAt:course.completedAt?new Date(course.completedAt).toLocaleDateString(`ko-KR`):null}));
  const requiredCourseTotal=summary.requiredTotal;
  const requiredCourseCompleted=summary.requiredCompleted;
  const requiredCompletionRate=requiredCourseTotal?Math.round((requiredCourseCompleted/requiredCourseTotal)*100):0;
  const overallCompletionRate=summary.courses?Math.round((summary.completed/summary.courses)*100):0;
  return (
    <section className="learner-profile-page-full">
      <div className="breadcrumb admin-detail-breadcrumb"><button onClick={onBack}>홈</button><span>›</span><button onClick={onBack}>학습자 관리</button><span>›</span>{profileUser.name}</div>
      <button className="department-back" onClick={onBack}>
        <Icon icon={ArrowLeft01Icon} />
        학습자 목록으로
      </button>
      <div className="learner-profile-hero">
        <div className="learner-profile-avatar">{profileUser.name[0]}</div>
        <div className="learner-profile-identity">
          <span>{profileUser.status === `ACTIVE` ? `활성` : `비활성`}</span>
          <h2>{profileUser.name}</h2>
          <p>
            {profileUser.organizationName || learner.dept} · {profileUser.position || `직책 미지정`} · {profileUser.employeeNumber || learner.id}
          </p>
        </div>
        <div className="learner-profile-contact">
          <span>이메일</span>
          <b>{profileUser.email}</b>
          <span>학습 포인트</span>
          <b>{summary.points.toLocaleString()}P</b>
        </div>
        <button className="secondary learner-profile-edit" onClick={() => { setEditForm({ name: profileUser.name, email: profileUser.email, position: profileUser.position || `` }); setEditTouched({}); setEditOpen(true); }}><Icon icon={Edit02Icon} size={16} />정보 수정</button>
      </div>
      <div className="learner-profile-summary">
        <div>
          <span>수강 과정</span>
          <b>{summary.courses}개</b>
        </div>
        <div>
          <span>수료 과정</span>
          <b>{summary.completed}개</b>
        </div>
        <div>
          <span>평균 진도율</span>
          <b>{summary.averageProgress}%</b>
        </div>
        <div>
          <span>보유 뱃지</span>
          <b>{summary.badgeCount}개</b>
        </div>
      </div>
      <div className="learner-profile-grid">
        <article className="panel learner-progress-history learner-overview-panel">
          <div className="panel-head">
            <div>
              <h2>학습 현황</h2>
              <p>필수교육 이수와 전체 수료 상태를 확인하세요.</p>
            </div>
          </div>
          <div className="learner-donut-grid">
            <div className="learner-donut-item">
              <div
                className="learner-donut required"
                style={{ "--donut-value": `${requiredCompletionRate * 3.6}deg` }}
              >
                <div><strong>{requiredCourseCompleted} / {requiredCourseTotal}</strong></div>
              </div>
              <b>필수교육 이수</b>
              <small>{requiredCourseTotal}개 중 {requiredCourseCompleted}개 완료</small>
            </div>
            <div className="learner-donut-item">
              <div
                className="learner-donut completion"
                style={{ "--donut-value": `${overallCompletionRate * 3.6}deg` }}
              >
                <div><strong>{overallCompletionRate}%</strong></div>
              </div>
              <b>전체 수료율</b>
              <small>{summary.courses}개 과정 중 {summary.completed}개 수료</small>
            </div>
          </div>
        </article>
        <article className="panel learner-badges-panel">
          <div className="panel-head">
            <div>
              <h2>획득 뱃지</h2>
              <p>학습 성과로 받은 뱃지입니다.</p>
            </div>
          </div>
          {(detail?.badges || []).map((badge) => (
            <div className="profile-badge-row" key={badge.id}>
              <span className={badge.tone || `blue`}>
                <Icon icon={badgeIconComponent(badge.icon)} />
              </span>
              <div>
                <b>{badge.name}</b>
                <small>{new Date(badge.awardedAt).toLocaleDateString(`ko-KR`)} 획득</small>
              </div>
            </div>
          ))}
          {!detail?.badges?.length && <p className="learner-management-empty">아직 획득한 뱃지가 없습니다.</p>}
        </article>
      </div>
      <div className="learner-course-section">
        <div>
          <h2>수강 과정</h2>
          <span>총 {learningCourses.length}개</span>
        </div>
        <div className="table-wrap">
          <table className="learner-detail-course-table">
            <thead>
              <tr>
                <th>교육과정</th>
                <th>교육 기간</th>
                <th>진도율</th>
                <th>강의 회차</th>
                <th>설문 제출</th>
                <th>학습 상태</th>
                <th>수료일</th>
              </tr>
            </thead>
            <tbody>
              {learningCourses.map((course, index) => (
                <tr key={`${course.id}-${index}`}>
                  <td>
                    <b>{course.title}</b>
                    <small>{course.category}</small>
                  </td>
                  <td>{course.period}</td>
                  <td>
                    <div className="rate-cell">
                      <span>
                        <i style={{ width: `${course.learningProgress}%` }} />
                      </span>
                      <b>{course.learningProgress}%</b>
                    </div>
                  </td>
                  <td className="learner-lesson-count">
                    {course.completedLessons}/{course.totalLessons}
                  </td>
                  <td>
                    {course.surveyRequired
                      ? course.surveySubmitted
                        ? <span className="survey-submit-state done">제출 완료</span>
                        : <span className="survey-submit-state pending">미제출</span>
                      : <span className="survey-submit-state none">설문 없음</span>}
                  </td>
                  <td>
                    <span
                      className={`learning-state ${course.state === `수료` ? `complete` : course.state === `학습 중` ? `current` : `none`}`}
                    >
                      {course.state}
                    </span>
                  </td>
                  <td>{course.completedAt || `—`}</td>
                </tr>
              ))}
              {learningCourses.length === 0 && <tr><td colSpan="7" className="learner-management-empty">배정된 교육과정이 없습니다.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
      <div className={`learner-account-control ${profileUser.status === `INACTIVE` ? `inactive` : ``}`}><div><h3>{profileUser.status === `INACTIVE` ? `비활성 계정` : `계정 관리`}</h3><p>{profileUser.status === `INACTIVE` ? `학습 이력과 수료 기록은 유지되며, 다시 활성화할 수 있습니다.` : `비활성화해도 기존 학습 이력과 수료 기록은 유지됩니다.`}</p></div><button className={profileUser.status === `INACTIVE` ? `primary` : `learner-deactivate-button`} onClick={() => setStatusConfirmOpen(true)}>{profileUser.status === `INACTIVE` ? `계정 활성화` : `계정 비활성화`}</button></div>
      {editOpen && <div className="overlay center learner-registration-overlay" onMouseDown={() => setEditOpen(false)}><section className="learner-registration-modal learner-edit-modal" onMouseDown={(event) => event.stopPropagation()}><header><div><h2>학습자 정보 수정</h2><p>조직과 권한은 학습자 목록의 사용자 수정에서 변경할 수 있습니다.</p></div><button className="learner-registration-close" onClick={() => setEditOpen(false)} aria-label="닫기"><Icon icon={Cancel01Icon} size={19} /></button></header><div className="learner-registration-form"><label><span>이름 <b>*</b></span><input value={editForm.name} onChange={(event) => setEditForm((current) => ({ ...current, name: event.target.value }))} onBlur={() => setEditTouched((current) => ({ ...current, name: true }))} />{editTouched.name && editErrors.name && <small>{editErrors.name}</small>}</label><label><span>사번</span><input value={profileUser.employeeNumber || learner.id} disabled /><small className="learner-field-help">사번은 변경할 수 없습니다.</small></label><label className="learner-registration-wide"><span>이메일 <b>*</b></span><input type="email" value={editForm.email} onChange={(event) => setEditForm((current) => ({ ...current, email: event.target.value }))} onBlur={() => setEditTouched((current) => ({ ...current, email: true }))} />{(editTouched.email || editForm.email) && editErrors.email && <small>{editErrors.email}</small>}</label><label className="learner-registration-wide"><span>직책 <b>*</b></span><input value={editForm.position} onChange={(event) => setEditForm((current) => ({ ...current, position: event.target.value }))} /></label></div><footer><button className="secondary" onClick={() => setEditOpen(false)}>취소</button><button className="primary" disabled={!canSaveLearner} onClick={saveLearnerInfo}>저장</button></footer></section></div>}
      {statusConfirmOpen && <ConfirmModal title={profileUser.status === `INACTIVE` ? `계정을 다시 활성화할까요?` : `계정을 비활성화할까요?`} description={profileUser.status === `INACTIVE` ? `활성화하면 신규 학습을 다시 진행할 수 있습니다.` : `해당 학습자의 기존 학습 이력과 수료 기록은 유지됩니다.`} confirmLabel={profileUser.status === `INACTIVE` ? `활성화` : `비활성화`} tone={profileUser.status === `INACTIVE` ? `primary` : `danger`} onCancel={() => setStatusConfirmOpen(false)} onConfirm={toggleLearnerStatus} />}
    </section>
  );
}

function y({
  data: e,
  query: t,
  setQuery: n,
  dept: r,
  setDept: a,
  position: o,
  setPosition: s,
  onSelect: c,
}) {
  return (0, i.jsxs)(`section`, {
    className: `learner-list-page`,
    children: [
      (0, i.jsxs)(`div`, {
        className: `learner-filter-panel`,
        children: [
          (0, i.jsxs)(`div`, {
            className: `filter-title`,
            children: [
              (0, i.jsx)(`b`, { children: `학습자 검색` }),
              (0, i.jsx)(`span`, {
                children: `이름·사번·부서명으로 검색하거나 소속과 직급을 선택해 주세요.`,
              }),
            ],
          }),
          (0, i.jsxs)(`div`, {
            className: `learner-filter-fields`,
            children: [
              (0, i.jsxs)(`div`, {
                className: `search`,
                children: [
                  (0, i.jsx)(Icon, { icon: Search01Icon }),
                  (0, i.jsx)(`input`, {
                    value: t,
                    onChange: (e) => n(e.target.value),
                    placeholder: `이름, 사번 또는 부서명을 입력해 주세요`,
                  }),
                ],
              }),
              (0, i.jsx)(`select`, {
                value: r,
                onChange: (e) => a(e.target.value),
                "aria-label": `부서`,
                children: [
                  `전체 소속`,
                  `People팀`,
                  `마케팅팀`,
                  `개발팀`,
                  `세일즈팀`,
                  `운영팀`,
                ].map((e) => (0, i.jsx)(`option`, { children: e }, e)),
              }),
              (0, i.jsx)(`select`, {
                value: o,
                onChange: (e) => s(e.target.value),
                "aria-label": `직급`,
                children: [`전체 직급`, `인턴`, `매니저`, `파트장`, `팀장`].map(
                  (e) => (0, i.jsx)(`option`, { children: e }, e),
                ),
              }),
              (0, i.jsxs)(`button`, {
                className: `course-search-button`,
                onClick: () => n(t.trim()),
                children: [
                  (0, i.jsx)(Icon, { icon: Search01Icon }),
                  (0, i.jsx)(`span`, { children: `검색` }),
                ],
              }),
              (0, i.jsx)(`button`, {
                className: `filter-reset`,
                onClick: () => {
                  (n(``), a(`전체 소속`), s(`전체 직급`));
                },
                children: `초기화`,
              }),
            ],
          }),
        ],
      }),
      (0, i.jsxs)(`div`, {
        className: `learner-result-head`,
        children: [
          (0, i.jsx)(`span`, { children: `검색 결과` }),
          (0, i.jsxs)(`b`, { children: [e.length, `명`] }),
        ],
      }),
      (0, i.jsx)(`div`, {
        className: `table-wrap learner-table`,
        children: (0, i.jsxs)(`table`, {
          children: [
            (0, i.jsx)(`thead`, {
              children: (0, i.jsxs)(`tr`, {
                children: [
                  (0, i.jsx)(`th`, { children: `임직원` }),
                  (0, i.jsx)(`th`, { children: `소속` }),
                  (0, i.jsx)(`th`, { children: `직급` }),
                  (0, i.jsx)(`th`, { children: `수강 과정` }),
                  (0, i.jsx)(`th`, { children: `평균 진도율` }),
                  (0, i.jsx)(`th`, { children: `수료` }),
                  (0, i.jsx)(`th`, {}),
                ],
              }),
            }),
            (0, i.jsx)(`tbody`, {
              children: e.map((e) =>
                (0, i.jsxs)(
                  `tr`,
                  {
                    children: [
                      (0, i.jsx)(`td`, {
                        children: (0, i.jsxs)(`div`, {
                          className: `person`,
                          children: [
                            (0, i.jsx)(`span`, {
                              children: e.name.slice(0, 1),
                            }),
                            (0, i.jsxs)(`div`, {
                              children: [
                                (0, i.jsx)(`b`, { children: e.name }),
                                (0, i.jsx)(`small`, { children: e.id }),
                              ],
                            }),
                          ],
                        }),
                      }),
                      (0, i.jsx)(`td`, { children: e.dept }),
                      (0, i.jsx)(`td`, { children: e.position }),
                      (0, i.jsxs)(`td`, { children: [e.courses, `개`] }),
                      (0, i.jsx)(`td`, {
                        children: (0, i.jsxs)(`div`, {
                          className: `table-progress`,
                          children: [
                            (0, i.jsx)(d, { value: e.progress }),
                            (0, i.jsxs)(`span`, {
                              children: [e.progress, `%`],
                            }),
                          ],
                        }),
                      }),
                      (0, i.jsx)(`td`, {
                        children: (0, i.jsxs)(`b`, {
                          className: `completed-count`,
                          children: [e.completed, `개`],
                        }),
                      }),
                      (0, i.jsx)(`td`, {
                        children: (0, i.jsx)(`button`, {
                          className: `detail`,
                          onClick: () => c(e),
                          children: `자세히 보기`,
                        }),
                      }),
                    ],
                  },
                  e.id,
                ),
              ),
            }),
          ],
        }),
      }),
    ],
  });
}
function b({ learner: e, onClose: t }) {
  return (0, i.jsx)(`div`, {
    className: `overlay`,
    onMouseDown: t,
    children: (0, i.jsxs)(`aside`, {
      className: `drawer`,
      onMouseDown: (e) => e.stopPropagation(),
      children: [
        (0, i.jsxs)(`div`, {
          className: `drawer-head`,
          children: [
            (0, i.jsx)(`h2`, { children: `학습자 상세` }),
            (0, i.jsx)(`button`, {
              onClick: t,
              children: (0, i.jsx)(Icon, { icon: Cancel01Icon }),
            }),
          ],
        }),
        (0, i.jsxs)(`div`, {
          className: `person-card`,
          children: [
            (0, i.jsx)(`span`, { children: e.name.slice(0, 1) }),
            (0, i.jsxs)(`div`, {
              children: [
                (0, i.jsx)(`h3`, { children: e.name }),
                (0, i.jsxs)(`p`, { children: [e.dept, ` · `, e.position] }),
                (0, i.jsx)(`small`, { children: e.id }),
              ],
            }),
          ],
        }),
        (0, i.jsxs)(`div`, {
          className: `info-grid`,
          children: [
            (0, i.jsxs)(`div`, {
              children: [
                (0, i.jsx)(`span`, { children: `이메일` }),
                (0, i.jsxs)(`b`, {
                  children: [e.id.toLowerCase(), `@sparkplus.co`],
                }),
              ],
            }),
            (0, i.jsxs)(`div`, {
              children: [
                (0, i.jsx)(`span`, { children: `재직 상태` }),
                (0, i.jsx)(`b`, { children: e.status }),
              ],
            }),
            (0, i.jsxs)(`div`, {
              children: [
                (0, i.jsx)(`span`, { children: `수강 과정` }),
                (0, i.jsxs)(`b`, { children: [e.courses, `개`] }),
              ],
            }),
            (0, i.jsxs)(`div`, {
              children: [
                (0, i.jsx)(`span`, { children: `수료 과정` }),
                (0, i.jsxs)(`b`, { children: [e.completed, `개`] }),
              ],
            }),
          ],
        }),
        (0, i.jsxs)(`div`, {
          className: `progress-card`,
          children: [
            (0, i.jsxs)(`div`, {
              children: [
                (0, i.jsx)(`span`, { children: `전체 평균 진도율` }),
                (0, i.jsxs)(`strong`, { children: [e.progress, `%`] }),
              ],
            }),
            (0, i.jsx)(d, { value: e.progress }),
          ],
        }),
        (0, i.jsx)(`h3`, { className: `section-title`, children: `수강 과정` }),
        a.slice(0, e.courses).map((t, n) =>
          (0, i.jsxs)(
            `div`,
            {
              className: `mini-course`,
              children: [
                (0, i.jsxs)(`div`, {
                  children: [
                    (0, i.jsx)(`b`, { children: t.title }),
                    (0, i.jsx)(`small`, {
                      children:
                        n < e.completed
                          ? `수료 완료`
                          : n === e.completed
                            ? `수강 중`
                            : `미수강`,
                    }),
                  ],
                }),
                (0, i.jsx)(`span`, {
                  children:
                    n < e.completed
                      ? `100%`
                      : n === e.completed
                        ? e.progress + `%`
                        : `0%`,
                }),
              ],
            },
            t.id,
          ),
        ),
      ],
    }),
  });
}
function x({ onCreate: e }) {
  return (0, i.jsxs)(i.Fragment, {
    children: [
      (0, i.jsxs)(`div`, {
        className: `toolbar`,
        children: [
          (0, i.jsxs)(`div`, {
            className: `sub-tabs`,
            children: [
              (0, i.jsx)(`button`, {
                className: `active`,
                children: `배정 내역`,
              }),
              (0, i.jsx)(`button`, { children: `배정 기준 관리` }),
            ],
          }),
          (0, i.jsx)(`button`, {
            className: `primary`,
            onClick: e,
            children: [(0, i.jsx)(Icon, { icon: Add01Icon }), `교육과정 배정`],
          }),
        ],
      }),
      (0, i.jsxs)(`section`, {
        className: `panel`,
        children: [
          (0, i.jsx)(m, { learner: !0 }),
          (0, i.jsx)(`div`, {
            className: `table-wrap`,
            children: (0, i.jsxs)(`table`, {
              children: [
                (0, i.jsx)(`thead`, {
                  children: (0, i.jsxs)(`tr`, {
                    children: [
                      (0, i.jsx)(`th`, { children: `교육과정` }),
                      (0, i.jsx)(`th`, { children: `배정 대상` }),
                      (0, i.jsx)(`th`, { children: `구분` }),
                      (0, i.jsx)(`th`, { children: `배정 인원` }),
                      (0, i.jsx)(`th`, { children: `학습 기한` }),
                      (0, i.jsx)(`th`, { children: `필수 여부` }),
                      (0, i.jsx)(`th`, { children: `관리` }),
                    ],
                  }),
                }),
                (0, i.jsx)(`tbody`, {
                  children: a.map((e, t) =>
                    (0, i.jsxs)(
                      `tr`,
                      {
                        children: [
                          (0, i.jsx)(`td`, {
                            children: (0, i.jsx)(`b`, { children: e.title }),
                          }),
                          (0, i.jsx)(`td`, {
                            children: [
                              `전 임직원`,
                              `개발팀`,
                              `팀장·파트장`,
                              `신규 입사자`,
                            ][t],
                          }),
                          (0, i.jsx)(`td`, {
                            children: [`전체`, `부서`, `직급`, `개인`][t],
                          }),
                          (0, i.jsxs)(`td`, {
                            children: [[248, 54, 38, 12][t], `명`],
                          }),
                          (0, i.jsx)(`td`, {
                            children: e.period.split(` ~ `)[1],
                          }),
                          (0, i.jsx)(`td`, {
                            children:
                              t === 1
                                ? (0, i.jsx)(u, {
                                    tone: `gray`,
                                    children: `선택`,
                                  })
                                : (0, i.jsx)(u, {
                                    tone: `red`,
                                    children: `필수`,
                                  }),
                          }),
                          (0, i.jsx)(`td`, {
                            children: (0, i.jsxs)(`div`, {
                              className: `actions`,
                              children: [
                                (0, i.jsx)(`button`, {
                                  children: (0, i.jsx)(Icon, {
                                    icon: Edit02Icon,
                                  }),
                                }),
                                (0, i.jsx)(`button`, {
                                  className: `danger`,
                                  children: (0, i.jsx)(Icon, {
                                    icon: Cancel01Icon,
                                  }),
                                }),
                              ],
                            }),
                          }),
                        ],
                      },
                      e.id,
                    ),
                  ),
                }),
              ],
            }),
          }),
        ],
      }),
    ],
  });
}
function ResultsDetailModal({ title, subtitle, children, onClose }) {
  return (
    <div className="results-modal-backdrop" onMouseDown={onClose}>
      <aside
        className="results-detail-modal"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="results-modal-head">
          <div>
            <span>{title}</span>
            <h2>{subtitle}</h2>
          </div>
          <button onClick={onClose} aria-label="닫기">
            ×
          </button>
        </div>
        {children}
      </aside>
    </div>
  );
}

function CompletionManagementPage() {
  const initialRows = [
    {
      name: `김수민`,
      dept: `People팀`,
      course: `데이터 분석 기초 입문`,
      progress: 100,
      status: `수료 처리 대기`,
      conditions: [true, true, true, true],
      dates: [`2026.07.14`, `2026.08.09`, `2026.08.09`],
      incompleteLessons: `없음`,
    },
    {
      name: `이지은`,
      dept: `마케팅팀`,
      course: `개인정보보호 필수교육`,
      progress: 100,
      status: `수료`,
      conditions: [true, true, true, true],
      dates: [`2026.07.02`, `2026.07.28`, `2026.07.28`],
      completedAt: `2026.07.29 10:24`,
      incompleteLessons: `없음`,
    },
    {
      name: `박서준`,
      dept: `개발팀`,
      course: `생성형 AI 업무 활용`,
      progress: 72,
      status: `미수료`,
      conditions: [false, false, true, false],
      dates: [`2026.07.21`, `2026.08.02`, `-`],
      incompleteLessons: `4·5차시`,
    },
    {
      name: `최하늘`,
      dept: `세일즈팀`,
      course: `처음 맡는 팀장을 위한 리더십`,
      progress: 100,
      status: `수료 처리 대기`,
      conditions: [true, true, true, true],
      dates: [`2026.07.08`, `2026.08.08`, `2026.08.08`],
      incompleteLessons: `없음`,
    },
    {
      name: `정유진`,
      dept: `운영팀`,
      course: `개인정보보호 필수교육`,
      progress: 100,
      status: `수료`,
      conditions: [true, true, true, true],
      dates: [`2026.07.01`, `2026.07.20`, `2026.07.20`],
      completedAt: `2026.07.21 14:10`,
      incompleteLessons: `없음`,
    },
    {
      name: `김도윤`,
      dept: `개발팀`,
      course: `데이터 분석 기초 입문`,
      progress: 46,
      status: `미수료`,
      conditions: [false, false, false, false],
      dates: [`2026.07.18`, `2026.07.29`, `-`],
      incompleteLessons: `3·4·5차시`,
    },
    {
      name: `윤서아`,
      dept: `People팀`,
      course: `생성형 AI 업무 활용`,
      progress: 100,
      status: `수료 처리 대기`,
      conditions: [true, true, true, true],
      dates: [`2026.07.10`, `2026.08.10`, `2026.08.10`],
      incompleteLessons: `없음`,
    },
    {
      name: `오지훈`,
      dept: `세일즈팀`,
      course: `개인정보보호 필수교육`,
      progress: 100,
      status: `수료`,
      conditions: [true, true, true, true],
      dates: [`2026.07.03`, `2026.07.25`, `2026.07.25`],
      completedAt: `2026.07.26 09:18`,
      incompleteLessons: `없음`,
    },
  ].map((row, index) => ({ id: index + 1, ...row }));
  const [rows, setRows] = r.useState(initialRows);
  const [query, setQuery] = r.useState(``);
  const [dept, setDept] = r.useState(`전체 부서`);
  const [status, setStatus] = r.useState(`전체 수료 상태`);
  const [period, setPeriod] = r.useState(`교육 기간 · 최근 3개월`);
  const [detail, setDetail] = r.useState(null);
  const filtered = rows.filter(
    (item) =>
      (!query || item.course.includes(query) || item.name.includes(query)) &&
      (dept === `전체 부서` || item.dept === dept) &&
      (status === `전체 수료 상태` || item.status === status),
  );
  const processCompletion = (id) => {
    setRows((current) =>
      current.map((item) =>
        item.id === id
          ? { ...item, status: `수료`, completedAt: `2026.08.11 14:30` }
          : item,
      ),
    );
    setDetail(null);
  };
  const reset = () => {
    setQuery(``);
    setDept(`전체 부서`);
    setStatus(`전체 수료 상태`);
    setPeriod(`교육 기간 · 최근 3개월`);
  };
  return (
    <section className="results-section completion-management-page">
      <SearchFilterPanel
        value={query}
        onValueChange={setQuery}
        placeholder="학습자 또는 교육과정 검색"
        filters={[
          { label: `부서`, value: dept, onChange: setDept, options: [`전체 부서`, `People팀`, `개발팀`, `마케팅팀`, `세일즈팀`, `운영팀`] },
          { label: `수료 상태`, value: status, onChange: setStatus, options: [`전체 수료 상태`, `수료`, `수료 처리 대기`, `미수료`] },
          { label: `기간`, value: period, onChange: setPeriod, options: [`교육 기간 · 최근 3개월`, `교육 기간 · 최근 6개월`, `교육 기간 · 올해 전체`] },
        ]}
        onSearch={() => {}}
        onReset={reset}
      />
      <div className="results-kpi-grid three completion-kpis">
        <button
          className={status === `수료` ? `selected complete` : `complete`}
          onClick={() => setStatus(`수료`)}
        >
          <span>수료</span>
          <strong>182명</strong>
          <small>86.7%</small>
        </button>
        <button
          className={
            status === `수료 처리 대기` ? `selected waiting` : `waiting`
          }
          onClick={() => setStatus(`수료 처리 대기`)}
        >
          <span>수료 처리 대기</span>
          <strong>7명</strong>
          <small>처리 필요</small>
        </button>
        <button
          className={status === `미수료` ? `selected incomplete` : `incomplete`}
          onClick={() => setStatus(`미수료`)}
        >
          <span>미수료</span>
          <strong>21명</strong>
          <small>10.0%</small>
        </button>
      </div>
      <div className="results-list-head">
        <div>
          <h2>학습자 목록</h2>
          <span>{filtered.length}명</span>
        </div>
        <small>{period.replace(`교육 기간 · `, ``)} 교육 기간 기준</small>
      </div>
      <div className="table-wrap results-table">
        <table>
          <thead>
            <tr>
              <th>학습자</th>
              <th>부서</th>
              <th>교육과정</th>
              <th>진도율</th>
              <th>수료 조건</th>
              <th>수료 상태</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <tr key={item.id}>
                <td>
                  <b>{item.name}</b>
                </td>
                <td>{item.dept}</td>
                <td>{item.course}</td>
                <td>
                  <div className="compact-result-progress">
                    <i style={{ width: `${item.progress}%` }} />
                    <span>{item.progress}%</span>
                  </div>
                </td>
                <td>
                  <CompletionConditionSummary conditions={item.conditions} />
                </td>
                <td>
                  <span
                    className={`completion-state ${item.status === `수료` ? `complete` : item.status === `미수료` ? `incomplete` : `waiting`}`}
                  >
                    {item.status}
                  </span>
                </td>
                <td>
                  <div className="row-actions">
                    {item.status === `수료 처리 대기` && (
                      <button
                        className="process"
                        onClick={() => setDetail(item)}
                      >
                        수료 처리
                      </button>
                    )}
                    {item.status === `미수료` && (
                      <button
                        className="reason"
                        onClick={() => setDetail(item)}
                      >
                        사유 확인
                      </button>
                    )}
                    {item.status === `수료` && (
                      <button
                        className="history"
                        onClick={() => setDetail(item)}
                      >
                        처리 내역
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {detail && (
        <ResultsDetailModal
          title={
            detail.status === `수료 처리 대기`
              ? `학습자 수료 확인`
              : detail.status === `미수료`
                ? `미수료 사유 확인`
                : `수료 처리 내역`
          }
          subtitle={detail.name}
          onClose={() => setDetail(null)}
        >
          <div className="completion-detail-course">
            <span>교육과정</span>
            <b>{detail.course}</b>
          </div>
          <div className="completion-detail-section">
            <div className="completion-detail-title">
              <h3>수료 조건</h3>
              <b>{detail.conditions.filter(Boolean).length}/4 충족</b>
            </div>
            <CompletionConditionList conditions={detail.conditions} />
          </div>
          {detail.status === `미수료` && (
            <div className="completion-detail-section incomplete-reason-box">
              <h3>미충족 항목</h3>
              <dl>
                <div>
                  <dt>현재 진도율</dt>
                  <dd>{detail.progress}%</dd>
                </div>
                <div>
                  <dt>미완료 차시</dt>
                  <dd>{detail.incompleteLessons}</dd>
                </div>
                <div>
                  <dt>평가</dt>
                  <dd>
                    {detail.conditions[2] ? `통과` : `미응시 또는 미통과`}
                  </dd>
                </div>
                <div>
                  <dt>설문</dt>
                  <dd>{detail.conditions[3] ? `제출 완료` : `미제출`}</dd>
                </div>
              </dl>
            </div>
          )}
          <div className="completion-detail-section">
            <h3>학습 정보</h3>
            <dl className="learning-date-list">
              <div>
                <dt>학습 시작일</dt>
                <dd>{detail.dates[0]}</dd>
              </div>
              <div>
                <dt>마지막 학습일</dt>
                <dd>{detail.dates[1]}</dd>
              </div>
              <div>
                <dt>교육 완료일</dt>
                <dd>{detail.dates[2]}</dd>
              </div>
              {detail.completedAt && (
                <div>
                  <dt>수료 처리일</dt>
                  <dd>{detail.completedAt}</dd>
                </div>
              )}
            </dl>
          </div>
          <div className="completion-current-state">
            <span>현재 상태</span>
            <b
              className={`completion-state ${detail.status === `수료` ? `complete` : detail.status === `미수료` ? `incomplete` : `waiting`}`}
            >
              {detail.status}
            </b>
          </div>
          <div className="completion-modal-actions">
            <button onClick={() => setDetail(null)}>닫기</button>
            {detail.status === `수료 처리 대기` && (
              <button
                className="final-process"
                disabled={!detail.conditions.every(Boolean)}
                onClick={() => processCompletion(detail.id)}
              >
                최종 수료 처리
              </button>
            )}
          </div>
        </ResultsDetailModal>
      )}
    </section>
  );
}

function CompletionConditionSummary({ conditions }) {
  const labels = [`진도`, `차시`, `평가`, `설문`];
  return (
    <div
      className="condition-summary"
      title={`${conditions.filter(Boolean).length}/4 충족`}
    >
      {labels.map((label, index) => (
        <span key={label} className={conditions[index] ? `met` : `unmet`}>
          {label} {conditions[index] ? `✓` : `–`}
        </span>
      ))}
    </div>
  );
}

function CompletionConditionList({ conditions }) {
  const labels = [
    `진도율 기준 충족`,
    `필수 차시 전체 완료`,
    `평가 통과`,
    `설문 제출 완료`,
  ];
  return (
    <ul className="condition-detail-list">
      {labels.map((label, index) => (
        <li key={label} className={conditions[index] ? `met` : `unmet`}>
          <i>{conditions[index] ? `✓` : `!`}</i>
          {label}
        </li>
      ))}
    </ul>
  );
}

function SurveyAssessmentPage() {
  const [query, setQuery] = r.useState(``);
  const forms = [
    { course: `개인정보보호 필수교육`, title: `수료 후 만족도 설문`, connected: true, period: `08.01 ~ 08.31`, url: SAMPLE_GOOGLE_FORM_URL },
    { course: `신규 입사자 온보딩`, title: `온보딩 만족도 조사`, connected: true, period: `상시`, url: SAMPLE_GOOGLE_FORM_URL },
    { course: `리더십 기본 과정`, title: `-`, connected: false, period: `-`, url: `` },
    { course: `생성형 AI 업무 활용`, title: `AI 활용 과정 만족도 조사`, connected: true, period: `08.03 ~ 08.31`, url: SAMPLE_GOOGLE_FORM_URL },
  ];
  const visible = forms.filter((item) => !query || `${item.course} ${item.title}`.toLowerCase().includes(query.toLowerCase()));
  return (
    <section className="results-section google-form-admin-page">
      <div className="google-form-admin-toolbar">
        <div className="search"><Icon icon={Search01Icon} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="교육과정 또는 설문명 검색" /></div>
        <button className="filter-search-button">검색</button>
        <button className="filter-reset" onClick={() => setQuery(``)}><Icon icon={RefreshIcon} />초기화</button>
      </div>
      <div className="results-list-head"><div><h2>설문 관리</h2><span>{visible.length}개 과정</span></div></div>
      <div className="table-wrap results-table google-form-admin-table">
        <table>
          <thead><tr><th>교육과정</th><th>설문</th><th>연결 상태</th><th>설문 기간</th><th>관리</th></tr></thead>
          <tbody>{visible.map((item) => <tr key={item.course}><td><b>{item.course}</b></td><td>{item.title}</td><td><span className={`google-form-status ${item.connected ? `connected` : ``}`}>{item.connected ? `연결됨` : `미연결`}</span></td><td>{item.period}</td><td>{item.connected ? <div className="google-form-table-actions"><a href={googleFormEmbedUrl(item.url).replace(`?embedded=true`, ``)} target="_blank" rel="noreferrer">설문 열기</a><a href={item.url} target="_blank" rel="noreferrer">응답 결과 보기</a></div> : <button className="analysis-button" onClick={() => alert(`교육과정 수정 화면에서 Google Forms 링크를 연결해 주세요.`)}>설문 연결</button>}</td></tr>)}</tbody>
        </table>
      </div>
    </section>
  );
}

function LegacySurveyResultsPage() {
  const [query, setQuery] = r.useState(``);
  const [dept, setDept] = r.useState(`전체 부서`);
  const [surveyStatus, setSurveyStatus] = r.useState(`전체 상태`);
  const [period, setPeriod] = r.useState(`최근 3개월`);
  const [sort, setSort] = r.useState(`최근 설문순`);
  const [detail, setDetail] = r.useState(null);
  const surveys = [
    {
      course: `신입사원 온보딩`,
      title: `신입사원 온보딩 만족도 조사`,
      dept: `전체 부서`,
      period: `08.01 ~ 08.10`,
      fullPeriod: `2026.08.01 ~ 2026.08.10`,
      people: 137,
      target: 217,
      rate: 63,
      score: 4.8,
      status: `응답 독려 필요`,
    },
    {
      course: `개인정보보호 필수교육`,
      title: `개인정보보호 교육 만족도 조사`,
      dept: `전체 부서`,
      period: `07.20 ~ 08.12`,
      fullPeriod: `2026.07.20 ~ 2026.08.12`,
      people: 204,
      target: 224,
      rate: 91,
      score: 4.5,
      status: `응답 수집 중`,
    },
    {
      course: `처음 맡는 팀장을 위한 리더십`,
      title: `리더십 과정 만족도 조사`,
      dept: `People팀`,
      period: `07.15 ~ 07.31`,
      fullPeriod: `2026.07.15 ~ 2026.07.31`,
      people: 28,
      target: 36,
      rate: 78,
      score: 4.7,
      status: `마감`,
    },
    {
      course: `생성형 AI 업무 활용`,
      title: `생성형 AI 교육 만족도 조사`,
      dept: `개발팀`,
      period: `08.03 ~ 08.15`,
      fullPeriod: `2026.08.03 ~ 2026.08.15`,
      people: 96,
      target: 133,
      rate: 72,
      score: 4.6,
      status: `응답 수집 중`,
    },
  ];
  const visible = surveys
    .filter(
      (item) =>
        (!query || item.course.includes(query) || item.title.includes(query)) &&
        (dept === `전체 부서` ||
          item.dept === dept ||
          item.dept === `전체 부서`) &&
        (surveyStatus === `전체 상태` || item.status === surveyStatus),
    )
    .sort((a, b) =>
      sort === `응답률 높은 순`
        ? b.rate - a.rate
        : sort === `응답률 낮은 순`
          ? a.rate - b.rate
          : sort === `만족도 높은 순`
            ? b.score - a.score
            : sort === `만족도 낮은 순`
              ? a.score - b.score
              : 0,
    );
  const reset = () => {
    setQuery(``);
    setDept(`전체 부서`);
    setSurveyStatus(`전체 상태`);
    setPeriod(`최근 3개월`);
    setSort(`최근 설문순`);
  };
  return (
    <section className="results-section assessment-page survey-results-only-page">
      <div className="assessment-kpi-grid survey-kpi-grid">
        <AssessmentKpi label="전체 설문" value="4개" note="현재 운영 기준" />
        <AssessmentKpi label="평균 응답률" value="74%" note="전체 과정 평균" />
        <AssessmentKpi label="평균 만족도" value="4.6 / 5" note="응답자 기준" />
      </div>
      <SearchFilterPanel
        value={query}
        onValueChange={setQuery}
        placeholder="교육과정 또는 설문 검색"
        filters={[
          { label: `부서`, value: dept, onChange: setDept, options: [`전체 부서`, `People팀`, `개발팀`, `마케팅팀`, `세일즈팀`] },
          { label: `설문 상태`, value: surveyStatus, onChange: setSurveyStatus, options: [`전체 상태`, `응답 수집 중`, `응답 독려 필요`, `마감`] },
          { label: `기간`, value: period, onChange: setPeriod, options: [`최근 3개월`, `최근 6개월`, `올해 전체`] },
          { label: `정렬`, value: sort, onChange: setSort, options: [`최근 설문순`, `응답률 높은 순`, `응답률 낮은 순`, `만족도 높은 순`, `만족도 낮은 순`] },
        ]}
        onSearch={() => {}}
        onReset={reset}
      />
      <div className="results-list-head">
        <div>
          <h2>과정별 설문 결과</h2>
          <span>{visible.length}개 과정</span>
        </div>
        <small>{period}</small>
      </div>
      <div className="table-wrap results-table survey-results-table">
        <table>
          <thead>
            <tr>
              <th>교육과정</th>
              <th>설문 기간</th>
              <th>응답 현황</th>
              <th>응답률</th>
              <th>평균 만족도</th>
              <th>상태</th>
              <th>상세</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((item) => (
              <tr key={item.course}>
                <td>
                  <b>{item.course}</b>
                </td>
                <td>{item.period}</td>
                <td>
                  <b className="response-count">
                    {item.people} / {item.target}명
                  </b>
                </td>
                <td>
                  <ResultProgress value={item.rate} />
                </td>
                <td>
                  <b className="survey-score">★ {item.score} / 5</b>
                </td>
                <td>
                  <AssessmentState value={item.status} />
                </td>
                <td>
                  <button
                    className="analysis-button"
                    onClick={() => setDetail(item)}
                  >
                    상세 보기
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {detail && (
        <SurveyResultDrawer item={detail} onClose={() => setDetail(null)} />
      )}
    </section>
  );
}

function SurveyResultDrawer({ item, onClose }) {
  const questions = createDefaultSurveyQuestions();
  const results = [
    {
      average: 4.6,
      responses: item.people,
      distribution: [
        { label: `★★★★★`, count: 82, percent: 60 },
        { label: `★★★★☆`, count: 35, percent: 26 },
        { label: `★★★☆☆`, count: 14, percent: 10 },
        { label: `★★☆☆☆`, count: 4, percent: 3 },
        { label: `★☆☆☆☆`, count: 2, percent: 1 },
      ],
    },
    {
      distribution: [
        { label: `실무 사례`, count: 82, percent: 60 },
        { label: `강의 설명`, count: 31, percent: 23 },
        { label: `실습`, count: 17, percent: 12 },
        { label: `교육 자료`, count: 7, percent: 5 },
      ],
    },
    {
      distribution: [
        { label: `실무 사례`, count: 91, percent: 66 },
        { label: `심화 이론`, count: 48, percent: 35 },
        { label: `실습`, count: 77, percent: 56 },
        { label: `Q&A`, count: 34, percent: 25 },
      ],
    },
    {
      responses: 94,
      comments: [
        `실무 사례가 구체적이어서 좋았습니다.`,
        `실습 시간이 조금 더 있었으면 좋겠습니다.`,
        `교육 자료를 다시 볼 수 있으면 좋겠습니다.`,
        `업무에 적용할 수 있는 예시가 유용했습니다.`,
        `후속 심화 과정도 개설되면 좋겠습니다.`,
        `질의응답 시간이 더 길었으면 합니다.`,
      ],
    },
  ];
  const survey = {
    surveyDescription: `교육 내용과 운영에 대한 의견을 들려주세요. 응답 내용은 향후 교육 개선에 활용됩니다.`,
    surveyAnonymous: true,
    surveyQuestions: questions,
  };
  return (
    <ResultsDetailModal
      title="설문 결과 상세"
      subtitle={item.title}
      onClose={onClose}
    >
      <div className="survey-result-summary">
        <div>
          <span>설문 기간</span>
          <b>{item.fullPeriod}</b>
        </div>
        <div>
          <span>응답</span>
          <b>
            {item.people} / {item.target}명
          </b>
        </div>
        <div>
          <span>응답률</span>
          <b>{item.rate}%</b>
        </div>
        <div>
          <span>전체 평균 만족도</span>
          <b>{item.score} / 5</b>
        </div>
        <div>
          <span>미응답</span>
          <b>{item.target - item.people}명</b>
        </div>
      </div>
      <SurveyFormView survey={survey} mode="result" results={results} />
      <div
        className={`survey-management-insight ${item.rate < 70 ? `attention` : ``}`}
      >
        <b>{item.rate < 70 ? `응답 독려 필요` : `개선 의견 확인`}</b>
        <p>
          {item.rate < 70
            ? `현재 응답률이 ${item.rate}%입니다. 미응답자를 대상으로 설문 참여 안내를 권장합니다.`
            : `전체 만족도는 높지만 ‘실습 시간이 부족하다’는 의견이 반복적으로 확인됩니다.`}
        </p>
      </div>
    </ResultsDetailModal>
  );
}

function LegacySurveyAssessmentPage() {
  const [tab, setTab] = r.useState(`survey`);
  const [query, setQuery] = r.useState(``);
  const [dept, setDept] = r.useState(`전체 부서`);
  const [period, setPeriod] = r.useState(`최근 3개월`);
  const [sort, setSort] = r.useState(`응답률 높은 순`);
  const [detail, setDetail] = r.useState(null);
  const surveys = [
    {
      course: `신입사원 온보딩`,
      dept: `전체 부서`,
      people: 137,
      target: 217,
      rate: 63,
      score: 4.8,
      status: `응답 독려 필요`,
    },
    {
      course: `개인정보보호 필수교육`,
      dept: `전체 부서`,
      people: 204,
      target: 224,
      rate: 91,
      score: 4.5,
      status: `정상`,
    },
    {
      course: `처음 맡는 팀장을 위한 리더십`,
      dept: `People팀`,
      people: 28,
      target: 36,
      rate: 78,
      score: 4.7,
      status: `응답 수집 중`,
    },
    {
      course: `생성형 AI 업무 활용`,
      dept: `개발팀`,
      people: 96,
      target: 133,
      rate: 72,
      score: 4.6,
      status: `마감`,
    },
  ];
  const assessments = [
    {
      course: `신입사원 온보딩`,
      dept: `전체 부서`,
      people: 178,
      target: 217,
      score: 76,
      pass: 82,
      status: `보완 필요`,
      highest: 100,
      lowest: 42,
    },
    {
      course: `개인정보보호 필수교육`,
      dept: `전체 부서`,
      people: 218,
      target: 224,
      score: 88,
      pass: 94,
      status: `정상`,
      highest: 100,
      lowest: 61,
    },
    {
      course: `처음 맡는 팀장을 위한 리더십`,
      dept: `People팀`,
      people: 31,
      target: 36,
      score: 81,
      pass: 87,
      status: `진행 중`,
      highest: 98,
      lowest: 55,
    },
    {
      course: `생성형 AI 업무 활용`,
      dept: `개발팀`,
      people: 112,
      target: 133,
      score: 79,
      pass: 85,
      status: `진행 중`,
      highest: 100,
      lowest: 48,
    },
  ];
  const source = tab === `survey` ? surveys : assessments;
  const filtered = source
    .filter(
      (item) =>
        (!query || item.course.includes(query)) &&
        (dept === `전체 부서` ||
          item.dept === dept ||
          item.dept === `전체 부서`),
    )
    .sort((a, b) => {
      if (tab !== `survey`) return 0;
      if (sort === `응답률 낮은 순`) return a.rate - b.rate;
      if (sort === `만족도 높은 순`) return b.score - a.score;
      if (sort === `만족도 낮은 순`) return a.score - b.score;
      return b.rate - a.rate;
    });
  const switchTab = (next) => {
    setTab(next);
    setDetail(null);
  };
  return (
    <section className="results-section assessment-page">
      <div className="results-tabs">
        <button
          className={tab === `survey` ? `active` : ``}
          onClick={() => switchTab(`survey`)}
        >
          설문 결과
        </button>
        <button
          className={tab === `assessment` ? `active` : ``}
          onClick={() => switchTab(`assessment`)}
        >
          평가 결과
        </button>
      </div>
      <div className="assessment-kpi-grid">
        {tab === `survey` ? (
          <>
            <AssessmentKpi
              label="진행/대상 설문"
              value="4개 과정"
              note="현재 운영 기준"
            />
            <AssessmentKpi
              label="평균 응답률"
              value="74%"
              note="전체 과정 평균"
            />
            <AssessmentKpi
              label="평균 만족도"
              value="4.6 / 5"
              note="응답자 기준"
            />
            <AssessmentKpi
              label="응답 독려 필요"
              value="1개"
              note="우선 확인"
              attention
            />
          </>
        ) : (
          <>
            <AssessmentKpi
              label="총 응시 인원"
              value="539명"
              note="선택 기간 누적"
            />
            <AssessmentKpi
              label="평균 점수"
              value="81점"
              note="전체 과정 평균"
            />
            <AssessmentKpi label="평균 통과율" value="87%" note="응시자 기준" />
            <AssessmentKpi
              label="미응시 인원"
              value="84명"
              note="안내 필요"
              attention
            />
          </>
        )}
      </div>
      <div
        className={`results-filter assessment-filter ${tab === `survey` ? `five-fields` : `four-fields`}`}
      >
        <div className="search">
          <Icon icon={Search01Icon} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="교육과정 검색"
          />
        </div>
        <select value={dept} onChange={(e) => setDept(e.target.value)}>
          {[`전체 부서`, `People팀`, `개발팀`, `마케팅팀`, `세일즈팀`].map(
            (v) => (
              <option key={v}>{v}</option>
            ),
          )}
        </select>
        <select value={period} onChange={(e) => setPeriod(e.target.value)}>
          {[`최근 3개월`, `최근 6개월`, `올해 전체`].map((v) => (
            <option key={v}>{v}</option>
          ))}
        </select>
        {tab === `survey` && (
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            aria-label="설문 결과 정렬"
          >
            {[
              `응답률 높은 순`,
              `응답률 낮은 순`,
              `만족도 높은 순`,
              `만족도 낮은 순`,
            ].map((v) => (
              <option key={v}>{v}</option>
            ))}
          </select>
        )}
        <button className="filter-search-button">검색</button>
        <button
          className="filter-reset"
          onClick={() => {
            setQuery(``);
            setDept(`전체 부서`);
            setPeriod(`최근 3개월`);
            setSort(`응답률 높은 순`);
          }}
        >
          <Icon icon={RefreshIcon} />
          초기화
        </button>
      </div>
      <div className="results-list-head">
        <div>
          <h2>{tab === `survey` ? `과정별 설문 결과` : `과정별 평가 결과`}</h2>
          <span>{filtered.length}개 과정</span>
        </div>
        <small>{period}</small>
      </div>
      <div className="table-wrap results-table">
        <table>
          <thead>
            <tr>
              {tab === `survey` ? (
                <>
                  <th>교육과정</th>
                  <th>응답 현황</th>
                  <th>응답률</th>
                  <th>평균 만족도</th>
                  <th>상태</th>
                  <th>상세</th>
                </>
              ) : (
                <>
                  <th>교육과정</th>
                  <th>응시 현황</th>
                  <th>평균 점수</th>
                  <th>통과율</th>
                  <th>상태</th>
                  <th>상세</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <tr key={item.course}>
                <td>
                  <b>{item.course}</b>
                </td>
                <td>
                  <b className="response-count">
                    {item.people} / {item.target}명
                  </b>
                </td>
                {tab === `survey` ? (
                  <>
                    <td>
                      <ResultProgress value={item.rate} />
                    </td>
                    <td>
                      <b>{item.score} / 5</b>
                    </td>
                    <td>
                      <AssessmentState value={item.status} />
                    </td>
                  </>
                ) : (
                  <>
                    <td>
                      <b>{item.score}점</b>
                    </td>
                    <td>
                      <ResultProgress value={item.pass} />
                    </td>
                    <td>
                      <AssessmentState value={item.status} />
                    </td>
                  </>
                )}
                <td>
                  <button
                    className="analysis-button"
                    onClick={() => setDetail(item)}
                  >
                    상세 분석
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {detail && (
        <ResultsDetailModal
          title={tab === `survey` ? `설문 상세 분석` : `평가 상세 분석`}
          subtitle={detail.course}
          onClose={() => setDetail(null)}
        >
          {tab === `survey` ? (
            <SurveyAnalysisDetail item={detail} />
          ) : (
            <AssessmentAnalysisDetail item={detail} />
          )}
        </ResultsDetailModal>
      )}
    </section>
  );
}

function AssessmentKpi({ label, value, note, attention = false }) {
  return (
    <div className={attention ? `attention` : ``}>
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{note}</small>
    </div>
  );
}

function ResultProgress({ value }) {
  return (
    <div className="assessment-progress">
      <i>
        <b style={{ width: `${value}%` }} />
      </i>
      <span>{value}%</span>
    </div>
  );
}

function AssessmentState({ value }) {
  const attention = [`응답 독려 필요`, `보완 필요`].includes(value);
  const done = [`정상`, `마감`].includes(value);
  return (
    <span
      className={`assessment-state ${attention ? `attention` : done ? `done` : `collecting`}`}
    >
      {value}
    </span>
  );
}

function AnalysisBar({ label, value, suffix = `/ 5` }) {
  const width = suffix === `/ 5` ? value * 20 : value;
  return (
    <div className="analysis-bar-row">
      <div>
        <span>{label}</span>
        <b>
          {value} {suffix}
        </b>
      </div>
      <i>
        <b style={{ width: `${width}%` }} />
      </i>
    </div>
  );
}

function SurveyAnalysisDetail({ item }) {
  const [showAll, setShowAll] = r.useState(false);
  const comments = [
    `실무 사례가 구체적이어서 좋았습니다.`,
    `실습 시간이 조금 더 있었으면 좋겠습니다.`,
    `교육 자료를 다시 볼 수 있으면 좋겠습니다.`,
    `업무에 적용할 수 있는 예시가 유용했습니다.`,
    `후속 심화 과정도 개설되면 좋겠습니다.`,
  ];
  return (
    <div className="analysis-detail-body">
      <div className="analysis-summary-strip">
        <div>
          <span>응답</span>
          <b>
            {item.people} / {item.target}명
          </b>
        </div>
        <div>
          <span>응답률</span>
          <b>{item.rate}%</b>
        </div>
        <div>
          <span>평균 만족도</span>
          <b>{item.score} / 5</b>
        </div>
      </div>
      <section className="analysis-detail-section">
        <h3>문항별 결과</h3>
        <AnalysisBar label="교육 내용이 실무에 도움이 되었나요?" value={4.8} />
        <AnalysisBar label="교육 난이도는 적절했나요?" value={4.5} />
        <AnalysisBar label="강의 구성에 만족하나요?" value={4.7} />
      </section>
      <section className="analysis-detail-section">
        <h3>응답 분포</h3>
        <AnalysisBar label="매우 만족" value={62} suffix="%" />
        <AnalysisBar label="만족" value={28} suffix="%" />
        <AnalysisBar label="보통" value={8} suffix="%" />
        <AnalysisBar label="불만족" value={2} suffix="%" />
      </section>
      <section className="analysis-detail-section">
        <div className="analysis-section-head">
          <h3>주관식 의견</h3>
          <span>{item.people}개 응답</span>
        </div>
        <div className="comment-list">
          {comments.slice(0, showAll ? 5 : 3).map((comment) => (
            <p key={comment}>“{comment}”</p>
          ))}
        </div>
        <button className="show-comments" onClick={() => setShowAll(!showAll)}>
          {showAll ? `대표 의견만 보기` : `전체 의견 보기`}
        </button>
      </section>
      <div className={`analysis-insight ${item.rate < 70 ? `attention` : ``}`}>
        <b>관리 인사이트</b>
        <p>
          {item.rate < 70
            ? `응답률이 ${item.rate}%로 낮습니다. 미응답자를 대상으로 설문 참여 안내를 권장합니다.`
            : `평균 만족도는 높지만 ‘실습 시간’ 관련 보완 의견이 반복되고 있습니다.`}
        </p>
      </div>
    </div>
  );
}

function AssessmentAnalysisDetail({ item }) {
  return (
    <div className="analysis-detail-body">
      <div className="analysis-summary-strip four">
        <div>
          <span>응시</span>
          <b>
            {item.people} / {item.target}명
          </b>
        </div>
        <div>
          <span>평균 점수</span>
          <b>{item.score}점</b>
        </div>
        <div>
          <span>통과율</span>
          <b>{item.pass}%</b>
        </div>
        <div>
          <span>미응시</span>
          <b>{item.target - item.people}명</b>
        </div>
      </div>
      <section className="analysis-detail-section score-range">
        <h3>점수 요약</h3>
        <div>
          <span>
            최고점 <b>{item.highest}점</b>
          </span>
          <span>
            최저점 <b>{item.lowest}점</b>
          </span>
        </div>
      </section>
      <section className="analysis-detail-section">
        <h3>점수 분포</h3>
        <AnalysisBar label="90점 이상" value={32} suffix="%" />
        <AnalysisBar label="80–89점" value={38} suffix="%" />
        <AnalysisBar label="70–79점" value={20} suffix="%" />
        <AnalysisBar label="70점 미만" value={10} suffix="%" />
      </section>
      <section className="analysis-detail-section">
        <h3>문항별 정답률</h3>
        <AnalysisBar label="1. 개인정보 처리 원칙" value={92} suffix="%" />
        <AnalysisBar label="2. 생성형 AI 정보 검증" value={78} suffix="%" />
        <AnalysisBar label="3. 업무 적용 사례 판단" value={54} suffix="%" />
      </section>
      <div className="analysis-insight attention">
        <b>관리 인사이트</b>
        <p>
          3번 문항의 정답률이 54%로 가장 낮습니다. 관련 차시의 보충 학습과
          미응시자 안내를 권장합니다.
        </p>
      </div>
    </div>
  );
}

function StatisticsReportPage() {
  const [query, setQuery] = r.useState(``);
  const [dept, setDept] = r.useState(`전체 부서`);
  const [position, setPosition] = r.useState(`전체 직급`);
  const [period, setPeriod] = r.useState(`최근 6개월`);
  const [sort, setSort] = r.useState(`수료율 높은 순`);
  const [detail, setDetail] = r.useState(null);
  const [hoveredMonth, setHoveredMonth] = r.useState(null);
  const courses = [
    {
      title: `개인정보보호 필수교육`,
      learners: 214,
      complete: 188,
      incomplete: 26,
      rate: 88,
      score: 4.5,
    },
    {
      title: `생성형 AI 업무 활용`,
      learners: 126,
      complete: 103,
      incomplete: 23,
      rate: 82,
      score: 4.7,
    },
    {
      title: `데이터 분석 기초 입문`,
      learners: 84,
      complete: 66,
      incomplete: 18,
      rate: 79,
      score: 4.6,
    },
    {
      title: `처음 맡는 팀장을 위한 리더십`,
      learners: 32,
      complete: 23,
      incomplete: 9,
      rate: 72,
      score: 4.8,
    },
    {
      title: `협업을 높이는 커뮤니케이션`,
      learners: 68,
      complete: 46,
      incomplete: 22,
      rate: 68,
      score: 3.9,
    },
  ];
  const months = [
    { m: `3월`, rate: 58 },
    { m: `4월`, rate: 62 },
    { m: `5월`, rate: 66 },
    { m: `6월`, rate: 69 },
    { m: `7월`, rate: 73 },
    { m: `8월`, rate: 78 },
  ];
  const departments = [
    [`마케팅팀`, 88],
    [`People팀`, 84],
    [`운영팀`, 81],
    [`개발팀`, 76],
    [`세일즈팀`, 71],
  ];
  const visible = courses
    .filter((item) => !query || item.title.includes(query))
    .sort((a, b) =>
      sort === `수료율 낮은 순`
        ? a.rate - b.rate
        : sort === `만족도 높은 순`
          ? b.score - a.score
          : sort === `만족도 낮은 순`
            ? a.score - b.score
            : sort === `참여 인원 많은 순`
              ? b.learners - a.learners
              : b.rate - a.rate,
    );
  const points = months.map((item, index) => ({
    x: 62 + index * 104,
    y: 250 - item.rate * 1.9,
    ...item,
  }));
  const download = () => {
    const csv = `교육과정,학습 현황,수료율,만족도\n${courses.map((course) => `${course.title},${course.complete}/${course.learners}명 수료,${course.rate}%,${course.score}/5`).join(`\n`)}`;
    const link = document.createElement(`a`);
    link.href = URL.createObjectURL(
      new Blob([`\ufeff${csv}`], { type: `text/csv` }),
    );
    link.download = `SPARKPLUS_LMS_교육성과리포트.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  };
  const reset = () => {
    setQuery(``);
    setDept(`전체 부서`);
    setPosition(`전체 직급`);
    setPeriod(`최근 6개월`);
  };
  return (
    <section className="results-section statistics-report-page statistics-report-v2">
      <div className="report-actions">
        <span>최근 업데이트 2026.08.10</span>
        <button className="primary" onClick={download}>
          <Icon icon={Download01Icon} />
          리포트 다운로드
        </button>
      </div>
      <div className="results-filter statistics-filter">
        <div className="search">
          <Icon icon={Search01Icon} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="교육과정 검색"
          />
        </div>
        <select value={dept} onChange={(event) => setDept(event.target.value)}>
          {[`전체 부서`, `People팀`, `개발팀`, `마케팅팀`, `세일즈팀`].map(
            (value) => (
              <option key={value}>{value}</option>
            ),
          )}
        </select>
        <select
          value={position}
          onChange={(event) => setPosition(event.target.value)}
        >
          {[`전체 직급`, `인턴`, `매니저`, `파트장`, `팀장`].map((value) => (
            <option key={value}>{value}</option>
          ))}
        </select>
        <select
          value={period}
          onChange={(event) => setPeriod(event.target.value)}
        >
          {[`최근 6개월`, `최근 3개월`, `올해 전체`].map((value) => (
            <option key={value}>{value}</option>
          ))}
        </select>
        <button className="filter-search-button">검색</button>
        <button className="filter-reset" onClick={reset}>
          <Icon icon={RefreshIcon} />
          초기화
        </button>
      </div>
      <div className="statistics-kpi-grid">
        <div>
          <span>평균 수료율</span>
          <strong>78%</strong>
          <small>전월 대비 +4.2%p</small>
        </div>
        <div>
          <span>평균 만족도</span>
          <strong>4.7 / 5</strong>
          <small>5점 만점</small>
        </div>
        <div>
          <span>교육 참여 인원</span>
          <strong>248명</strong>
          <small>이번 달 +18명</small>
        </div>
      </div>
      <article className="results-card completion-trend-card">
        <div className="results-card-head">
          <div>
            <h2>월별 수료율 추이</h2>
            <p>최근 6개월 동안의 최종 수료율 변화입니다.</p>
          </div>
          <span className="single-legend">수료율</span>
        </div>
        <div className="completion-chart-wrap">
          <svg viewBox="0 0 650 280" preserveAspectRatio="none">
            <g className="report-y-labels">
              {[100, 75, 50, 25, 0].map((value, index) => (
                <text key={value} x="5" y={60 + index * 47}>
                  {value}%
                </text>
              ))}
            </g>
            <g className="report-grid">
              {[55, 102, 149, 196, 243].map((y) => (
                <line key={y} x1="55" x2="600" y1={y} y2={y} />
              ))}
            </g>
            <polyline
              points={points.map((point) => `${point.x},${point.y}`).join(` `)}
              className="report-line completion"
            />
            {points.map((point, index) => (
              <g
                key={point.m}
                className="trend-point"
                onMouseEnter={() => setHoveredMonth(index)}
                onMouseLeave={() => setHoveredMonth(null)}
              >
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="13"
                  className="trend-hit"
                />
                <circle cx={point.x} cy={point.y} r="5" className="trend-dot" />
                {hoveredMonth === index && (
                  <g className="trend-tooltip">
                    <rect
                      x={point.x - 36}
                      y={point.y - 47}
                      width="72"
                      height="30"
                      rx="8"
                    />
                    <text x={point.x} y={point.y - 28}>
                      {point.m} {point.rate}%
                    </text>
                  </g>
                )}
              </g>
            ))}
          </svg>
          <div className="report-months">
            {months.map((item) => (
              <span key={item.m}>{item.m}</span>
            ))}
          </div>
        </div>
      </article>
      <div className="performance-focus-grid">
        <article className="results-card department-rate-card">
          <div className="results-card-head">
            <div>
              <h2>부서별 수료율</h2>
              <p>주요 부서의 평균 수료율을 비교합니다.</p>
            </div>
            <button>전체 보기</button>
          </div>
          <div className="department-rate-list">
            {departments.map(([name, value]) => (
              <div className="dept-result-row" key={name}>
                <span>{name}</span>
                <div>
                  <i style={{ width: `${value}%` }} />
                </div>
                <b>{value}%</b>
              </div>
            ))}
          </div>
        </article>
        <article className="results-card attention-course-card">
          <div className="results-card-head">
            <div>
              <h2>관리 필요 과정</h2>
              <p>우선 확인이 필요한 교육과정입니다.</p>
            </div>
          </div>
          <div className="attention-course-list">
            {[courses[3], courses[4], courses[2]].map((course, index) => (
              <button key={course.title} onClick={() => setDetail(course)}>
                <div>
                  <b>{course.title}</b>
                  <span>
                    수료율 {course.rate}%
                    {course.score < 4.2 ? ` · 만족도 ${course.score}` : ``}
                    {course.incomplete >= 18
                      ? ` · 미수료 ${course.incomplete}명`
                      : ``}
                  </span>
                </div>
                <em>
                  {index === 0
                    ? `수료율 확인 필요`
                    : index === 1
                      ? `성과 확인 필요`
                      : `미수료 확인`}
                </em>
                <i>›</i>
              </button>
            ))}
          </div>
        </article>
      </div>
      <div className="results-list-head">
        <div>
          <h2>과정별 성과 요약</h2>
          <span>{visible.length}개 과정</span>
        </div>
        <select value={sort} onChange={(event) => setSort(event.target.value)}>
          {[
            `수료율 높은 순`,
            `수료율 낮은 순`,
            `만족도 높은 순`,
            `만족도 낮은 순`,
            `참여 인원 많은 순`,
          ].map((value) => (
            <option key={value}>{value}</option>
          ))}
        </select>
      </div>
      <div className="table-wrap results-table performance-summary-table">
        <table>
          <thead>
            <tr>
              <th>교육과정</th>
              <th>학습 현황</th>
              <th>수료율</th>
              <th>만족도</th>
              <th>상세</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((item) => (
              <tr key={item.title}>
                <td>
                  <b>{item.title}</b>
                </td>
                <td>
                  <div className="learning-result-cell">
                    <b>
                      {item.complete} / {item.learners}명 수료
                    </b>
                    <span>미수료 {item.incomplete}명</span>
                  </div>
                </td>
                <td>
                  <b className="performance-rate">{item.rate}%</b>
                </td>
                <td>{item.score} / 5</td>
                <td>
                  <button
                    className="analysis-button"
                    onClick={() => setDetail(item)}
                  >
                    상세 보기
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {detail && (
        <PerformanceDetailDrawer
          item={detail}
          onClose={() => setDetail(null)}
        />
      )}
    </section>
  );
}

function PerformanceDetailDrawer({ item, onClose }) {
  const trend = [58, 62, 66, 69, 73, item.rate];
  return (
    <ResultsDetailModal
      title="과정 상세 성과"
      subtitle={item.title}
      onClose={onClose}
    >
      <div className="performance-detail-summary">
        <div>
          <span>현재 수료율</span>
          <b>{item.rate}%</b>
        </div>
        <div>
          <span>평균 만족도</span>
          <b>{item.score} / 5</b>
        </div>
        <div>
          <span>미수료</span>
          <b>{item.incomplete}명</b>
        </div>
      </div>
      <section className="performance-detail-section">
        <h3>최근 수료율 변화</h3>
        <div className="detail-trend-bars">
          {trend.map((value, index) => (
            <div key={index}>
              <i>
                <b style={{ height: `${value}%` }} />
              </i>
              <span>{index + 3}월</span>
              <small>{value}%</small>
            </div>
          ))}
        </div>
      </section>
      <section className="performance-detail-section">
        <h3>부서별 수료 현황</h3>
        <div className="department-rate-list compact">
          {[
            [`People팀`, Math.min(96, item.rate + 6)],
            [`개발팀`, Math.max(55, item.rate - 4)],
            [`마케팅팀`, Math.min(98, item.rate + 9)],
            [`세일즈팀`, Math.max(52, item.rate - 7)],
          ].map(([name, value]) => (
            <div className="dept-result-row" key={name}>
              <span>{name}</span>
              <div>
                <i style={{ width: `${value}%` }} />
              </div>
              <b>{value}%</b>
            </div>
          ))}
        </div>
      </section>
      <section className="performance-detail-section survey-summary">
        <h3>설문 결과 요약</h3>
        <div>
          <span>
            응답률 <b>74%</b>
          </span>
          <span>
            만족도 <b>{item.score} / 5</b>
          </span>
        </div>
        <p>
          {item.score < 4.2
            ? `실습 시간과 교육 난이도에 대한 개선 의견이 반복되고 있습니다.`
            : `실무 사례와 교육 구성에 대한 긍정 응답이 높게 나타났습니다.`}
        </p>
      </section>
      <div className="analysis-insight attention">
        <b>관리 인사이트</b>
        <p>
          {item.rate < 75
            ? `수료율이 전체 평균보다 낮습니다. 미수료자 안내와 학습 기한 확인을 권장합니다.`
            : `수료율은 안정적입니다. 부서별 격차가 큰 구간을 중심으로 학습 참여를 점검해 주세요.`}
        </p>
      </div>
    </ResultsDetailModal>
  );
}

function LegacyStatisticsReportPage() {
  const [query, setQuery] = r.useState(``);
  const [dept, setDept] = r.useState(`전체 부서`);
  const [position, setPosition] = r.useState(`전체 직급`);
  const [period, setPeriod] = r.useState(`최근 3개월`);
  const [sort, setSort] = r.useState(`수료율 높은 순`);
  const [detail, setDetail] = r.useState(null);
  const courses = [
    {
      title: `개인정보보호 필수교육`,
      learners: 214,
      complete: 188,
      incomplete: 26,
      rate: 88,
      score: 4.5,
    },
    {
      title: `생성형 AI 업무 활용`,
      learners: 126,
      complete: 103,
      incomplete: 23,
      rate: 82,
      score: 4.7,
    },
    {
      title: `데이터 분석 기초 입문`,
      learners: 84,
      complete: 66,
      incomplete: 18,
      rate: 79,
      score: 4.6,
    },
    {
      title: `처음 맡는 팀장을 위한 리더십`,
      learners: 32,
      complete: 23,
      incomplete: 9,
      rate: 72,
      score: 4.8,
    },
  ];
  const visible = courses
    .filter((item) => !query || item.title.includes(query))
    .sort((a, b) =>
      sort === `수료율 높은 순`
        ? b.rate - a.rate
        : sort === `수료율 낮은 순`
          ? a.rate - b.rate
          : b.learners - a.learners,
    );
  const download = () => {
    const csv = `교육과정,수강 인원,수료,미수료,수료율,만족도\n${courses.map((c) => `${c.title},${c.learners},${c.complete},${c.incomplete},${c.rate}%,${c.score}`).join(`\n`)}`;
    const link = document.createElement(`a`);
    link.href = URL.createObjectURL(
      new Blob([`\ufeff${csv}`], { type: `text/csv` }),
    );
    link.download = `SPARKPLUS_LMS_교육성과리포트.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  };
  const months = [
    { m: `3월`, p: 64, c: 58 },
    { m: `4월`, p: 68, c: 62 },
    { m: `5월`, p: 71, c: 66 },
    { m: `6월`, p: 74, c: 69 },
    { m: `7월`, p: 77, c: 73 },
    { m: `8월`, p: 81, c: 78 },
  ];
  const line = (key) =>
    months
      .map((item, idx) => `${45 + idx * 98},${205 - item[key] * 1.65}`)
      .join(` `);
  return (
    <section className="results-section statistics-report-page">
      <div className="report-actions">
        <span>최근 업데이트 2026.08.10</span>
        <button className="primary" onClick={download}>
          <Icon icon={Download01Icon} />
          리포트 다운로드
        </button>
      </div>
      <div className="results-filter five-fields">
        <div className="search">
          <Icon icon={Search01Icon} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="교육과정 검색"
          />
        </div>
        <select value={dept} onChange={(e) => setDept(e.target.value)}>
          {[`전체 부서`, `People팀`, `개발팀`, `마케팅팀`, `세일즈팀`].map(
            (v) => (
              <option key={v}>{v}</option>
            ),
          )}
        </select>
        <select value={position} onChange={(e) => setPosition(e.target.value)}>
          {[`전체 직급`, `인턴`, `매니저`, `파트장`, `팀장`].map((v) => (
            <option key={v}>{v}</option>
          ))}
        </select>
        <select value={period} onChange={(e) => setPeriod(e.target.value)}>
          {[`최근 3개월`, `최근 6개월`, `올해 전체`].map((v) => (
            <option key={v}>{v}</option>
          ))}
        </select>
        <button className="filter-search-button">검색</button>
        <button
          className="filter-reset"
          onClick={() => {
            setQuery(``);
            setDept(`전체 부서`);
            setPosition(`전체 직급`);
            setPeriod(`최근 3개월`);
          }}
        >
          <Icon icon={RefreshIcon} />
          초기화
        </button>
      </div>
      <div className="results-kpi-grid four">
        <div>
          <span>평균 수료율</span>
          <strong>78%</strong>
          <small>전월 대비 +4.2%p</small>
        </div>
        <div>
          <span>평균 진도율</span>
          <strong>81%</strong>
          <small>전월 대비 +3.8%p</small>
        </div>
        <div>
          <span>평균 만족도</span>
          <strong>4.7</strong>
          <small>5점 만점</small>
        </div>
        <div>
          <span>교육 참여 인원</span>
          <strong>248명</strong>
          <small>이번 달 +18명</small>
        </div>
      </div>
      <div className="report-chart-grid">
        <article className="results-card report-line-card">
          <div className="results-card-head">
            <div>
              <h2>월별 수료율 추이</h2>
              <p>최근 6개월의 진도율과 수료율 변화입니다.</p>
            </div>
            <div className="mini-legend">
              <span className="blue">평균 진도율</span>
              <span className="green">수료율</span>
            </div>
          </div>
          <svg viewBox="0 0 580 220" preserveAspectRatio="none">
            <g className="report-y-labels">
              {[100, 75, 50, 25, 0].map((value, index) => (
                <text key={value} x="2" y={43 + index * 40}>
                  {value}%
                </text>
              ))}
            </g>
            <g className="report-grid">
              {[40, 80, 120, 160, 200].map((y) => (
                <line key={y} x1="45" x2="535" y1={y} y2={y} />
              ))}
            </g>
            <polyline points={line(`p`)} className="report-line progress" />
            <polyline points={line(`c`)} className="report-line completion" />
          </svg>
          <div className="report-months">
            {months.map((x) => (
              <span key={x.m}>{x.m}</span>
            ))}
          </div>
        </article>
        <article className="results-card dept-performance">
          <div className="results-card-head">
            <div>
              <h2>부서별 교육 성과 비교</h2>
              <p>평균 수료율 기준입니다.</p>
            </div>
          </div>
          {[
            [`People팀`, 84],
            [`개발팀`, 76],
            [`마케팅팀`, 88],
            [`세일즈팀`, 71],
            [`운영팀`, 81],
          ].map(([name, value]) => (
            <div className="dept-result-row" key={name}>
              <span>{name}</span>
              <div>
                <i style={{ width: `${value}%` }} />
              </div>
              <b>{value}%</b>
            </div>
          ))}
        </article>
      </div>
      <div className="results-list-head">
        <div>
          <h2>과정별 성과 요약</h2>
          <span>{visible.length}개 과정</span>
        </div>
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          {[`수료율 높은 순`, `수료율 낮은 순`, `수강 인원 순`].map((v) => (
            <option key={v}>{v}</option>
          ))}
        </select>
      </div>
      <div className="table-wrap results-table">
        <table>
          <thead>
            <tr>
              <th>교육과정</th>
              <th>수강 인원</th>
              <th>수료</th>
              <th>미수료</th>
              <th>수료율</th>
              <th>만족도</th>
              <th>상세</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((item) => (
              <tr key={item.title}>
                <td>
                  <b>{item.title}</b>
                </td>
                <td>{item.learners}명</td>
                <td>{item.complete}명</td>
                <td>{item.incomplete}명</td>
                <td>
                  <b>{item.rate}%</b>
                </td>
                <td>{item.score} / 5</td>
                <td>
                  <button
                    className="analysis-button"
                    onClick={() => setDetail(item)}
                  >
                    분석 보기
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {detail && (
        <ResultsDetailModal
          title="과정 상세 분석"
          subtitle={detail.title}
          onClose={() => setDetail(null)}
        >
          <div className="modal-kpis">
            <div>
              <span>수강 인원</span>
              <b>{detail.learners}명</b>
            </div>
            <div>
              <span>수료율</span>
              <b>{detail.rate}%</b>
            </div>
            <div>
              <span>평균 만족도</span>
              <b>{detail.score}/5</b>
            </div>
          </div>
          <div className="modal-mini-chart">
            <h3>최근 6개월 수료율 추이</h3>
            {[58, 62, 66, 69, 73, detail.rate].map((v, i) => (
              <div key={i}>
                <i style={{ height: `${v}%` }} />
                <span>{i + 3}월</span>
              </div>
            ))}
          </div>
          <div className="results-note">
            수료 독려가 필요합니다. 미수료자 안내와 학습 기한 확인을 권장합니다.
          </div>
        </ResultsDetailModal>
      )}
    </section>
  );
}

function LearningRewardsPage() {
  const [tab, setTab] = r.useState(`ranking`);
  const [rankingScope, setRankingScope] = r.useState(`individual`);
  const [rankingRange, setRankingRange] = r.useState({ preset:`month`, ...adminQuickRange(`month`) });
  const [dept, setDept] = r.useState(`전체 부서`);
  const [detail, setDetail] = r.useState(null);
  const [pointRules, setPointRules] = r.useState([]);
  const [rewardPeople, setRewardPeople] = r.useState([]);
  const [recentRewards, setRecentRewards] = r.useState([]);
  const [rewardLoading, setRewardLoading] = r.useState(true);
  const [rewardError, setRewardError] = r.useState(``);
  const [pointRuleForm, setPointRuleForm] = r.useState(null);
  const [badgeFilter, setBadgeFilter] = r.useState(`전체`);
  const [badgeRuleForm, setBadgeRuleForm] = r.useState(null);
  const rangeIsValid = Boolean(rankingRange.start && rankingRange.end && rankingRange.start <= rankingRange.end);
  const lastValidRankingRange = r.useRef(rankingRange);
  if (rangeIsValid) lastValidRankingRange.current = rankingRange;
  const effectiveRankingRange = rangeIsValid ? rankingRange : lastValidRankingRange.current;
  const ranking = rewardPeople;
  const departmentRanking = [...new Set(rewardPeople.map((item) => item.dept))].map((department) => {
    const members = ranking.filter((item) => item.dept === department);
    const averagePoint = members.length ? Math.round(members.reduce((sum, item) => sum + item.point, 0) / members.length) : 0;
    return { dept:department, averagePoint, members:members.length, completionRate:Math.min(96, 58 + Math.round(averagePoint / 45)), completedCourses:members.reduce((sum, item) => sum + item.courses, 0) };
  }).sort((a, b) => b.averagePoint - a.averagePoint).map((item, index) => ({ ...item, rank:index + 1 }));
  const [badges, setBadges] = r.useState([]);
  r.useEffect(() => {
    let active=true; setRewardLoading(true); setRewardError(``);
    const query=new URLSearchParams({start:effectiveRankingRange.start,end:effectiveRankingRange.end});
    apiRequest(`/api/v1/admin/rewards?${query}`).then((data)=>{
      if(!active)return;
      const rankingItems = Array.isArray(data?.ranking) ? data.ranking : [];
      const ruleItems = Array.isArray(data?.rules) ? data.rules : [];
      const badgeItems = Array.isArray(data?.badges) ? data.badges : [];
      setRewardPeople(rankingItems.map((item) => ({
        ...item,
        point: Number(item.points ?? item.point ?? 0),
        points: Number(item.points ?? item.point ?? 0),
        courses: Number(item.courses || 0),
        badges: Number(item.badges || 0),
        rank: Number(item.rank || 0),
      })));
      setPointRules(ruleItems.map((rule)=>({...rule,id:rule.activityType,activityType:rewardActivityLabels[rule.activityType]||rule.activityType,targetType:`전체 교육과정`,course:``,threshold:1,frequency:`조건 달성마다`})));
      setBadges(badgeItems.map((badge)=>({...badge,activityType:rewardActivityLabels[badge.metric]||badge.metric,targetType:`전체 교육과정`,course:``})));
      setRecentRewards(Array.isArray(data?.recent) ? data.recent : []);
    }).catch((requestError)=>{if(active){setRewardPeople([]);setPointRules([]);setBadges([]);setRecentRewards([]);setRewardError(`리워드 데이터를 불러오지 못했습니다. (${requestError.message || `요청 실패`})`);}}).finally(()=>{if(active)setRewardLoading(false);});
    return()=>{active=false;};
  },[effectiveRankingRange.start,effectiveRankingRange.end]);
  const filteredRanking = ranking.filter(
    (item) => dept === `전체 부서` || item.dept === dept,
  );
  const period = formatAdminPeriod(effectiveRankingRange);
  const courseOptions = [];
  const rewardActivityLabels={LESSON_COMPLETE:`차시 완료`,COURSE_COMPLETE:`과정 수료`,QUIZ_COMPLETE:`퀴즈 완료`,SURVEY_SUBMIT:`설문 제출`,POINTS_TOTAL:`누적 포인트`};
  const rewardActivityCodes=Object.fromEntries(Object.entries(rewardActivityLabels).map(([code,label])=>[label,code]));
  const badgeIconOptions = [
    [`medal`, `메달`, Medal01Icon], [`trophy`, `트로피`, Award01Icon],
    [`star`, `별`, SparklesIcon], [`quiz`, `퀴즈`, Quiz01Icon],
    [`book`, `책`, BookOpen01Icon], [`ranking`, `랭킹`, RankingIcon],
  ];
  const badgeIconFor = (badge) => badgeIconOptions.find(([value]) => value === badge.icon)?.[2]
    || (badge.metric === `QUIZ_COMPLETE` ? Quiz01Icon : badge.metric === `COURSE_COMPLETE` ? Award01Icon : badge.metric === `POINTS_TOTAL` || badge.type === `랭킹형` ? RankingIcon : Medal01Icon);
  const conditionUnit = (activity) => activity === `POINTS_TOTAL` ? `P 이상` : `회 이상`;
  const ruleSummary = (rule) => `${rule.targetType === `특정 교육과정` ? rule.course : `전체 과정`} · ${rule.label||rewardActivityLabels[rule.activityType]||rule.activityType} · ${rule.frequency}`;
  const badgeSummary = (badge) => `${badge.targetType === `특정 교육과정` ? badge.course : `전체 과정`} · ${rewardActivityLabels[badge.activityType]||badge.activityType} ${badge.threshold}${conditionUnit(badge.activityType)}`;
  const savePointRule = async () => {
    if (pointRuleForm.targetType === `특정 교육과정` && !pointRuleForm.course) return alert(`적용할 교육과정을 선택해주세요.`);
    const rule = { ...pointRuleForm, points: Math.max(0, Number(pointRuleForm.points) || 0) };
    try{const activityCode=rewardActivityCodes[rule.activityType]||rule.activityType;const saved=await apiRequest(`/api/v1/admin/rewards/rules/${activityCode}`,{method:`PATCH`,body:JSON.stringify({points:rule.points,enabled:rule.enabled})});setPointRules((current)=>current.map((item)=>(rewardActivityCodes[item.activityType]||item.activityType)===saved.activityType?{...item,...saved,activityType:rewardActivityLabels[saved.activityType]||saved.activityType}:item));setPointRuleForm(null);showAdminToast(`포인트 기준이 저장되었습니다.`);}catch{showAdminToast(`포인트 기준을 저장하지 못했습니다.`);}
  };
  const saveBadgeRule = async () => {
    if (!badgeRuleForm.name.trim()) return alert(`뱃지명을 입력해주세요.`);
    if (badgeRuleForm.targetType === `특정 교육과정` && !badgeRuleForm.course) return alert(`적용할 교육과정을 선택해주세요.`);
    const badge = { ...badgeRuleForm, threshold: Math.max(1, Number(badgeRuleForm.threshold) || 1) };
    try{const payload={name:badge.name,description:badge.description||badgeSummary(badge),metric:rewardActivityCodes[badge.activityType]||badge.activityType,threshold:badge.threshold,type:badge.type,tone:badge.tone||`blue`,icon:badge.icon||`medal`,enabled:badge.enabled};const saved=await apiRequest(badge.id?`/api/v1/admin/rewards/badges/${badge.id}`:`/api/v1/admin/rewards/badges`,{method:badge.id?`PATCH`:`POST`,body:JSON.stringify(payload)});setBadges((current)=>badge.id?current.map((item)=>item.id===badge.id?{...item,...saved,activityType:rewardActivityLabels[saved.metric]||saved.metric}:item):[...current,{...saved,activityType:rewardActivityLabels[saved.metric]||saved.metric,people:0}]);setBadgeRuleForm(null);showAdminToast(`뱃지 기준이 저장되었습니다.`);}catch{showAdminToast(`뱃지 기준을 저장하지 못했습니다.`);}
  };
  return (
    <section className="results-section rewards-page">
      <div className="results-tabs">
        <button
          className={tab === `ranking` ? `active` : ``}
          onClick={() => setTab(`ranking`)}
        >
          학습 랭킹
        </button>
        <button
          className={tab === `points` ? `active` : ``}
          onClick={() => setTab(`points`)}
        >
          포인트 관리
        </button>
        <button
          className={tab === `badges` ? `active` : ``}
          onClick={() => setTab(`badges`)}
        >
          뱃지 관리
        </button>
      </div>
      {rewardError && <div className="reward-load-error"><Icon icon={Notification01Icon} size={17} /><span>{rewardError}</span><button type="button" onClick={() => window.location.reload()}>다시 불러오기</button></div>}
      {tab === `ranking` ? (
        <>
          <div className="reward-period-heading reward-period-toolbar" aria-label="학습 랭킹 기간 필터"><DateRangeFilter value={rankingRange} onChange={setRankingRange} mode="ranking" /></div>
          <div className="reward-toolbar">
            <div className="reward-ranking-scope">
              <button className={rankingScope === `individual` ? `active` : ``} onClick={() => setRankingScope(`individual`)}>개인 랭킹</button>
              <button className={rankingScope === `department` ? `active` : ``} onClick={() => setRankingScope(`department`)}>부서 랭킹</button>
            </div>
            {rankingScope === `individual` && (
              <select value={dept} onChange={(e) => setDept(e.target.value)}>
                {[`전체 부서`, ...new Set(rewardPeople.map((item) => item.dept))].map((v) => (
                  <option key={v}>{v}</option>
                ))}
              </select>
            )}
          </div>
          {rankingScope === `individual` ? (
            <>
            <RewardTopThree items={filteredRanking.slice(0, 3)} type="individual" />
            <div className="reward-list-heading"><div><h2>전체 개인 랭킹</h2><p>{period} 동안 적립한 포인트 순위입니다.</p></div><span>{filteredRanking.length}명</span></div>
            <div className="table-wrap results-table reward-table reward-ranking-table">
              <table>
                <thead>
                  <tr>
                    <th>순위</th>
                    <th>학습자</th>
                    <th>부서</th>
                    <th>학습 포인트</th>
                    <th>수료 과정 수</th>
                    <th>획득 뱃지</th>
                    <th>상세</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRanking.length === 0 && (
                    <tr><td colSpan="7" className="table-empty">{rewardLoading ? `리워드 데이터를 불러오고 있습니다.` : `선택한 기간에 적립된 실제 학습 포인트가 없습니다.`}</td></tr>
                  )}
                  {filteredRanking.map((item) => (
                    <tr key={item.rank} className={item.rank <= 3 ? `ranking-list-top rank-${item.rank}` : ``}>
                      <td>
                        <span className={`rank-number top-${item.rank}`}>
                          {item.rank <= 3 ? (
                            <Icon icon={Medal01Icon} size={18} />
                          ) : (
                            item.rank
                          )}
                        </span>
                      </td>
                      <td>
                        <b>{item.name}</b>
                      </td>
                      <td>{item.dept}</td>
                      <td>
                        <strong>{Number(item.point || 0).toLocaleString()}P</strong>
                      </td>
                      <td>{item.courses}개</td>
                      <td>{item.badges}개</td>
                      <td>
                        <button
                          className="analysis-button"
                          onClick={() => setDetail({ type: `points`, ...item })}
                        >
                          상세 보기
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            </>
          ) : (
            <><RewardTopThree items={departmentRanking.slice(0, 3)} type="department" /><DepartmentRankingTable departments={departmentRanking} period={period} /></>
          )}
        </>
      ) : tab === `points` ? (
        <>
          <div className="point-management-head"><div><h2>포인트 지급 기준</h2><p>실제 학습 활동과 지급 조건을 연결해 관리합니다.</p></div><button type="button" className="point-rule-add" onClick={() => setPointRuleForm({ id:null, activityType:`차시 완료`, targetType:`전체 교육과정`, course:``, threshold:1, frequency:`조건 달성마다`, points:20, enabled:true })}><Icon icon={Add01Icon} size={16} />포인트 기준 추가</button></div>
          <div className="table-wrap results-table point-rule-table"><table><thead><tr><th>활동 유형</th><th>적용 조건</th><th>지급 포인트</th><th>상태</th><th>관리</th></tr></thead><tbody>{pointRules.length === 0 && <tr><td colSpan="5" className="table-empty">등록된 포인트 지급 기준이 없습니다.</td></tr>}{pointRules.map((rule) => <tr key={rule.id}><td><b>{rule.activityType}</b></td><td><span className="rule-target-summary">{ruleSummary(rule)}</span></td><td><strong>+{rule.points}P</strong></td><td><span className={`point-rule-status ${rule.enabled ? `enabled` : ``}`}>{rule.enabled ? `사용 중` : `사용 안 함`}</span></td><td><button type="button" className="analysis-button" onClick={() => setPointRuleForm({ ...rule })}>수정</button></td></tr>)}</tbody></table></div>
          <div className="recent-point-section"><div><h2>최근 포인트 적립 내역</h2></div><div className="recent-point-list">{recentRewards.length===0?<p className="table-empty">실제 포인트 적립 내역이 없습니다.</p>:recentRewards.map((item)=><div key={item.id}><b>{item.name}</b><span>{item.description || item.label}</span><strong>+{item.points}P</strong><time>{new Date(item.createdAt).toLocaleDateString(`ko-KR`)}</time></div>)}</div></div>
        </>
      ) : (
        <>
          <div className="badge-page-intro">
            <div>
              <h2>지급 뱃지</h2>
              <p>사전에 정의된 뱃지의 조건과 자동 지급 여부를 관리합니다.</p>
            </div>
            <div className="badge-intro-actions"><span>활성 {badges.filter((badge) => badge.enabled).length}개</span><button type="button" className="point-rule-add" onClick={() => setBadgeRuleForm({ id: null, name: ``, activityType: `과정 수료`, targetType: `전체 교육과정`, course: ``, threshold: 1, type: `성취형`, tone:`blue`, icon:`medal`, enabled: true })}><Icon icon={Add01Icon} size={16} />뱃지 추가</button></div>
          </div>
          <div className="badge-filter-tabs">
            {[`전체`, `랭킹형`, `성취형`].map((item) => <button key={item} className={badgeFilter === item ? `active` : ``} onClick={() => setBadgeFilter(item)}>{item}</button>)}
          </div>
          <div className="fixed-badge-grid">
            {badges.length === 0 && <p className="table-empty">등록된 뱃지가 없습니다.</p>}
            {badges.filter((badge) => badgeFilter === `전체` || badge.type === badgeFilter).map((badge) => {
              return (
              <article className="fixed-badge-card" key={badge.name}>
                <div className="badge-card-head">
                  <div className={`fixed-badge-icon ${badge.tone}`}>
                    <Icon icon={badgeIconFor(badge)} size={25} />
                  </div>
                  <div className="badge-switch-wrap">
                    <span>{badge.enabled ? `사용 중` : `사용 안 함`}</span>
                    <button aria-label={`${badge.name} 활성화`} className={`rule-switch ${badge.enabled ? `on` : ``}`} onClick={() => setBadges((current) => current.map((item) => item.id === badge.id ? { ...item, enabled: !item.enabled } : item))}><i /></button>
                  </div>
                </div>
                <div className="fixed-badge-copy">
                  <span className="badge-type-chip">{badge.type}</span>
                  <h3>{badge.name}</h3>
                  <p>{badgeSummary(badge)}</p>
                </div>
                <div className="badge-card-meta">
                  <b>현재 획득 <strong>{badge.people}명</strong></b>
                  <span className="auto-badge">자동 지급</span>
                </div>
                <div className="badge-card-actions">
                  <button title={`${badge.name} 지급 현황`} onClick={() => setDetail({ type: `badgePeople`, ...badge })}>지급 현황 보기</button>
                  <button title={`${badge.name} 지급 기준`} onClick={() => setBadgeRuleForm({ ...badge })}>기준 보기/수정</button>
                </div>
              </article>
            )})}
          </div>
        </>
      )}
      {detail && (
        <ResultsDetailModal
          title={detail.type === `points` ? `포인트 적립 내역` : `뱃지 획득 현황`}
          subtitle={detail.name || `학습 활동별 적립 포인트를 확인하세요.`}
          onClose={() => setDetail(null)}
        >
          {detail.type === `points` ? (
            <><div className="point-detail-summary"><div><span>선택 기간 포인트</span><b>{Number(detail.point || 0).toLocaleString()}P</b></div><div><span>선택 기간 순위</span><b>{detail.rank}위</b></div><div><span>획득 뱃지</span><b>{detail.badges}개</b></div></div>
            <div className="point-history actual-history"><p className="table-empty">실제 포인트 적립 내역이 없습니다.</p></div></>
          ) : (
            <div className="badge-recipient-list"><p className="table-empty">실제 뱃지 획득 내역이 없습니다.</p></div>
          )}
        </ResultsDetailModal>
      )}
      {pointRuleForm && <div className="overlay center" onMouseDown={() => setPointRuleForm(null)}><section className="point-rule-editor structured-rule-editor" onMouseDown={(event) => event.stopPropagation()}><header><div><span>포인트 관리</span><h2>{pointRuleForm.id ? `포인트 기준 수정` : `포인트 기준 추가`}</h2></div><button onClick={() => setPointRuleForm(null)} aria-label="닫기"><Icon icon={Cancel01Icon} /></button></header><div className="point-rule-editor-body structured-rule-grid"><label>활동 유형<select value={pointRuleForm.activityType} onChange={(event) => setPointRuleForm((current) => ({ ...current, activityType: event.target.value, threshold: event.target.value === `퀴즈 완료` ? 80 : 1 }))}>{[`차시 완료`,`과정 수료`,`퀴즈 완료`,`설문 제출`].map((item) => <option key={item}>{item}</option>)}</select></label><label>적용 대상<select value={pointRuleForm.targetType} onChange={(event) => setPointRuleForm((current) => ({ ...current, targetType: event.target.value, course: `` }))}><option>전체 교육과정</option><option>특정 교육과정</option></select></label>{pointRuleForm.targetType === `특정 교육과정` && <label className="rule-grid-wide">교육과정<select value={pointRuleForm.course} onChange={(event) => setPointRuleForm((current) => ({ ...current, course: event.target.value }))}><option value="">교육과정을 선택해주세요</option>{courseOptions.map((item) => <option key={item}>{item}</option>)}</select></label>}<label>달성 기준<div className="point-input-with-unit"><input type="number" min="1" max={pointRuleForm.activityType === `퀴즈 완료` ? 100 : undefined} value={pointRuleForm.threshold} onChange={(event) => setPointRuleForm((current) => ({ ...current, threshold: event.target.value }))} /><span>{conditionUnit(pointRuleForm.activityType)}</span></div></label><label>지급 주기<select value={pointRuleForm.frequency} onChange={(event) => setPointRuleForm((current) => ({ ...current, frequency: event.target.value }))}><option>최초 1회</option><option>조건 달성마다</option></select></label><label>지급 포인트<div className="point-input-with-unit"><input type="number" min="0" value={pointRuleForm.points} onChange={(event) => setPointRuleForm((current) => ({ ...current, points: event.target.value }))} /><span>P</span></div></label><label>상태<select value={pointRuleForm.enabled ? `사용 중` : `사용 안 함`} onChange={(event) => setPointRuleForm((current) => ({ ...current, enabled: event.target.value === `사용 중` }))}><option>사용 중</option><option>사용 안 함</option></select></label></div><footer><button className="secondary" onClick={() => setPointRuleForm(null)}>취소</button><button className="primary" onClick={savePointRule}>저장</button></footer></section></div>}
      {badgeRuleForm && <div className="overlay center" onMouseDown={() => setBadgeRuleForm(null)}><section className="point-rule-editor structured-rule-editor" onMouseDown={(event) => event.stopPropagation()}><header><div><span>뱃지 관리</span><h2>{badgeRuleForm.id ? `뱃지 지급 기준 수정` : `뱃지 추가`}</h2></div><button onClick={() => setBadgeRuleForm(null)} aria-label="닫기"><Icon icon={Cancel01Icon} /></button></header><div className="point-rule-editor-body structured-rule-grid"><label className="rule-grid-wide">뱃지명<input value={badgeRuleForm.name} onChange={(event) => setBadgeRuleForm((current) => ({ ...current, name: event.target.value }))} placeholder="뱃지명을 입력해주세요" /></label><fieldset className="rule-grid-wide badge-icon-picker"><legend>뱃지 모양</legend><div>{badgeIconOptions.map(([value,label,icon]) => <button type="button" key={value} className={(badgeRuleForm.icon || `medal`) === value ? `active` : ``} onClick={() => setBadgeRuleForm((current) => ({ ...current, icon:value }))}><Icon icon={icon} size={22} /><span>{label}</span></button>)}</div></fieldset><label>뱃지 유형<select value={badgeRuleForm.type} onChange={(event) => setBadgeRuleForm((current) => ({ ...current, type: event.target.value }))}><option>성취형</option><option>랭킹형</option></select></label><label>활동 유형<select value={badgeRuleForm.activityType} onChange={(event) => setBadgeRuleForm((current) => ({ ...current, activityType: event.target.value, threshold: 1 }))}>{[`과정 수료`,`차시 완료`,`퀴즈 완료`,`연속 학습`,`월간 포인트 순위`,`월간 포인트 TOP`].map((item) => <option key={item}>{item}</option>)}</select></label><label>적용 대상<select value={badgeRuleForm.targetType} onChange={(event) => setBadgeRuleForm((current) => ({ ...current, targetType: event.target.value, course: `` }))}><option>전체 교육과정</option><option>특정 교육과정</option></select></label>{badgeRuleForm.targetType === `특정 교육과정` && <label>교육과정<select value={badgeRuleForm.course} onChange={(event) => setBadgeRuleForm((current) => ({ ...current, course: event.target.value }))}><option value="">교육과정을 선택해주세요</option>{courseOptions.map((item) => <option key={item}>{item}</option>)}</select></label>}<label>달성 기준<div className="point-input-with-unit"><input type="number" min="1" value={badgeRuleForm.threshold} onChange={(event) => setBadgeRuleForm((current) => ({ ...current, threshold: event.target.value }))} /><span>{conditionUnit(badgeRuleForm.activityType)}</span></div></label><label>상태<select value={badgeRuleForm.enabled ? `사용 중` : `사용 안 함`} onChange={(event) => setBadgeRuleForm((current) => ({ ...current, enabled: event.target.value === `사용 중` }))}><option>사용 중</option><option>사용 안 함</option></select></label></div><footer><button className="secondary" onClick={() => setBadgeRuleForm(null)}>취소</button><button className="primary" onClick={saveBadgeRule}>저장</button></footer></section></div>}
    </section>
  );
}

function RewardTopThree({ items, type }) {
  const visibleItems = items.slice(0, 3);
  return (
    <div className={`reward-top-section ${type}-reward-top`}>
      <div className="reward-section-title">
        <h2>TOP 3</h2>
      </div>
      <div className={`reward-podium-grid count-${visibleItems.length}`}>
        {visibleItems.map((item, index) => (
          <article className={`reward-podium-card rank-${index + 1}`} key={item.name || item.dept}>
            <span className="podium-medal"><Icon icon={Medal01Icon} size={24} /></span>
            <div className="podium-rank">{index + 1}위</div>
            <h3>{type === `individual` ? item.name : item.dept}</h3>
            <p>{type === `individual` ? item.dept : `참여 ${item.members}명`}</p>
            <strong>{Number(type === `individual` ? item.point : item.averagePoint).toLocaleString()}P</strong>
            {type === `department` && <small>1인당 평균</small>}
          </article>
        ))}
        {!visibleItems.length && <div className="reward-top-empty">선택한 기간에 랭킹 데이터가 없습니다.</div>}
      </div>
    </div>
  );
}

function DepartmentRankingTable({ departments, period }) {
  return (
    <div className="department-ranking-wrap">
      <div className="department-ranking-note">
        <div>
          <b>부서원 1인당 평균 학습 포인트 기준</b>
          <span>부서 규모와 관계없이 학습 참여도를 공정하게 비교합니다.</span>
        </div>
        <small>{period}</small>
      </div>
      <div className="table-wrap results-table reward-table department-ranking-table">
        <table>
          <thead>
            <tr>
              <th>순위</th>
              <th>부서</th>
              <th>평균 학습 포인트</th>
              <th>소속 인원</th>
              <th>수료율</th>
              <th>기간 내 수료</th>
            </tr>
          </thead>
          <tbody>
            {departments.length === 0 && (
              <tr><td colSpan="6" className="table-empty">선택한 기간에 집계된 실제 부서 포인트가 없습니다.</td></tr>
            )}
            {departments.map((item) => (
              <tr
                key={item.dept}
                className={item.rank <= 3 ? `top-department` : ``}
              >
                <td>
                  <span className={`rank-number top-${item.rank}`}>
                    {item.rank <= 3 ? (
                      <Icon icon={Medal01Icon} size={18} />
                    ) : (
                      item.rank
                    )}
                  </span>
                </td>
                <td>
                  <b>{item.dept}</b>
                  {item.rank <= 3 && <small>TOP {item.rank}</small>}
                </td>
                <td>
                  <strong>{item.averagePoint.toLocaleString()}P</strong>
                  <small>1인당 평균</small>
                </td>
                <td>{item.members}명</td>
                <td>{item.completionRate}%</td>
                <td>{item.completedCourses}개 과정</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PerformanceAnalysisV2() {
  const [tab, setTab] = r.useState(`성과`);
  const [query, setQuery] = r.useState(``);
  const [dept, setDept] = r.useState(`전체 소속`);
  const [position, setPosition] = r.useState(`전체 직급`);
  const [sort, setSort] = r.useState(`수강 인원순`);
  const [manageOnly, setManageOnly] = r.useState(false);
  const [page, setPage] = r.useState(1);
  const [selected, setSelected] = r.useState(null);
  const names = [
    `개인정보보호 필수교육`,
    `생성형 AI 업무 활용`,
    `데이터 분석 기초 입문`,
    `처음 맡는 팀장을 위한 리더십`,
    `협업을 높이는 커뮤니케이션`,
    `신입사원 온보딩`,
    `정보보안 기본교육`,
    `엑셀 데이터 시각화`,
    `프로젝트 관리 실무`,
    `고객 경험 디자인`,
    `성과 면담 가이드`,
    `문서 작성의 기술`,
    `SQL 데이터 분석`,
    `직장 내 괴롭힘 예방교육`,
    `재무 기초 이해`,
    `프레젠테이션 스킬`,
    `문제 해결과 의사결정`,
    `AI 시대의 리더십`,
  ];
  const departments = [
    `전체`,
    `개발팀`,
    `마케팅팀`,
    `People팀`,
    `운영팀`,
    `세일즈팀`,
  ];
  const positions = [`전체`, `매니저`, `인턴`, `팀장`, `파트장`];
  const rows = names.map((name, index) => {
    const learners = 32 + ((index * 37) % 191);
    const rate = 51 + ((index * 11) % 43);
    const complete = Math.round((learners * rate) / 100);
    return {
      id: index + 1,
      name,
      dept: departments[index % departments.length],
      position: positions[index % positions.length],
      learners,
      complete,
      incomplete: learners - complete,
      rate,
      previous: rate - (index % 3 === 0 ? -3 : 2 + (index % 4)),
      likes: 28 + ((index * 19) % 121),
      quiz: 68 + ((index * 7) % 27),
      response: 57 + ((index * 9) % 39),
      satisfaction: (4.1 + ((index * 3) % 8) / 10).toFixed(1),
    };
  });
  const filtered = rows
    .filter(
      (item) =>
        (!query || item.name.includes(query)) &&
        (dept === `전체 소속` || item.dept === `전체` || item.dept === dept) &&
        (position === `전체 직급` ||
          item.position === `전체` ||
          item.position === position) &&
        (!manageOnly || item.rate < 65),
    )
    .sort((a, b) =>
      sort === `수료율 높은순`
        ? b.rate - a.rate
        : sort === `수료율 낮은순`
          ? a.rate - b.rate
          : b.learners - a.learners,
    );
  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const visible = filtered.slice((page - 1) * pageSize, page * pageSize);
  const chartRows = [...filtered].sort((a, b) => b.rate - a.rate).slice(0, 6);
  const average = filtered.length
    ? Math.round(
        filtered.reduce((sum, item) => sum + item.rate, 0) / filtered.length,
      )
    : 0;
  const reset = () => {
    setQuery(``);
    setDept(`전체 소속`);
    setPosition(`전체 직급`);
    setSort(`수강 인원순`);
    setManageOnly(false);
    setPage(1);
  };
  return (
    <section className="performance-analysis-v2">
      <div className="analysis-filter-bar">
        <div className="search">
          <Icon icon={Search01Icon} />
          <input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
            }}
            placeholder="교육과정 검색"
          />
        </div>
        <select
          value={dept}
          onChange={(event) => {
            setDept(event.target.value);
            setPage(1);
          }}
        >
          {[
            `전체 소속`,
            `People팀`,
            `개발팀`,
            `마케팅팀`,
            `운영팀`,
            `세일즈팀`,
          ].map((value) => (
            <option key={value}>{value}</option>
          ))}
        </select>
        <select
          value={position}
          onChange={(event) => {
            setPosition(event.target.value);
            setPage(1);
          }}
        >
          {[`전체 직급`, `인턴`, `매니저`, `파트장`, `팀장`].map((value) => (
            <option key={value}>{value}</option>
          ))}
        </select>
        <select>
          <option>최근 3개월</option>
          <option>최근 6개월</option>
          <option>2026년 전체</option>
        </select>
        <button className="filter-search-button">검색</button>
        <button className="filter-reset" onClick={reset}>
          <Icon icon={RefreshIcon} />
          초기화
        </button>
      </div>

      <div className="analysis-findings">
        <div>
          <span>평균 수료율</span>
          <b>{average}%</b>
          <small className="up">전월보다 3.8%p 상승</small>
        </div>
        <div>
          <span>가장 큰 소속 격차</span>
          <b>18.4%p</b>
          <small>개발팀 ↔ 세일즈팀</small>
        </div>
      </div>

      <section className="panel analysis-chart-section">
        <div className="analysis-section-head">
          <div>
            <h2>과정 수료율 비교</h2>
            <p>현재 조건에서 수료율이 높은 6개 과정입니다.</p>
          </div>
          <button
            className="text-button"
            onClick={() => setSort(`수료율 낮은순`)}
          >
            관리 필요 과정 먼저 보기
          </button>
        </div>
        <div className="analysis-ranking-chart">
          {chartRows.map((item, index) => (
            <button key={item.id} onClick={() => setSelected(item)}>
              <span>{String(index + 1).padStart(2, `0`)}</span>
              <b>{item.name}</b>
              <div>
                <i style={{ width: `${item.rate}%` }} />
              </div>
              <strong>{item.rate}%</strong>
              <small>
                {item.complete}/{item.learners}명
              </small>
            </button>
          ))}
        </div>
      </section>

      <div className="analysis-list-head">
        <div className="performance-main-tabs">
          <button
            className={tab === `성과` ? `active` : ``}
            onClick={() => setTab(`성과`)}
          >
            과정 성과
          </button>
          <button
            className={tab === `퀴즈` ? `active` : ``}
            onClick={() => setTab(`퀴즈`)}
          >
            퀴즈 결과
          </button>
          <button
            className={tab === `설문` ? `active` : ``}
            onClick={() => setTab(`설문`)}
          >
            설문 결과
          </button>
        </div>
        <div>
          <button
            className={manageOnly ? `manage-filter active` : `manage-filter`}
            onClick={() => {
              setManageOnly(!manageOnly);
              setPage(1);
            }}
          >
            관리 필요 과정
          </button>
          <span>총 {filtered.length}개</span>
          <select
            value={sort}
            onChange={(event) => {
              setSort(event.target.value);
              setPage(1);
            }}
          >
            <option>수강 인원순</option>
            <option>수료율 높은순</option>
            <option>수료율 낮은순</option>
          </select>
        </div>
      </div>
      <div className="table-wrap scalable-performance-table">
        <table>
          <thead>
            <tr>
              <th>교육과정</th>
              {tab === `성과` ? (
                <>
                  <th>수강 인원</th>
                  <th>수료</th>
                  <th>미수료</th>
                  <th>수료율</th>
                  <th>좋아요</th>
                </>
              ) : tab === `퀴즈` ? (
                <>
                  <th>응시 인원</th>
                  <th>평균 점수</th>
                  <th>전월 대비</th>
                  <th>결과</th>
                </>
              ) : (
                <>
                  <th>응답 인원</th>
                  <th>응답률</th>
                  <th>만족도</th>
                  <th>답변</th>
                </>
              )}
              <th>상세</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((item) => (
              <tr key={item.id}>
                <td>
                  <b>{item.name}</b>
                  <small>
                    {item.dept} · {item.position}
                  </small>
                </td>
                {tab === `성과` ? (
                  <>
                    <td>{item.learners}명</td>
                    <td className="complete-number">{item.complete}명</td>
                    <td className="incomplete-number">{item.incomplete}명</td>
                    <td>
                      <div className="rate-cell">
                        <span>
                          <i style={{ width: `${item.rate}%` }} />
                        </span>
                        <b>{item.rate}%</b>
                      </div>
                    </td>
                    <td>
                      <span className="like-stat">
                        <Icon icon={ThumbsUpIcon} size={14} />
                        {item.likes}
                      </span>
                    </td>
                  </>
                ) : tab === `퀴즈` ? (
                  <>
                    <td>{Math.round(item.learners * 0.82)}명</td>
                    <td>
                      <b>{item.quiz}점</b>
                    </td>
                    <td className={item.quiz > 78 ? `trend-up` : `trend-down`}>
                      {item.quiz > 78 ? `+3.2점` : `-1.4점`}
                    </td>
                    <td>
                      <button className="detail">응시 결과</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>
                      {Math.round((item.learners * item.response) / 100)}명
                    </td>
                    <td>{item.response}%</td>
                    <td>
                      <b>{item.satisfaction} / 5</b>
                    </td>
                    <td>
                      <button className="detail">답변 조회</button>
                    </td>
                  </>
                )}
                <td>
                  <button className="detail" onClick={() => setSelected(item)}>
                    분석 보기
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="analysis-pagination">
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>
          ‹
        </button>
        {Array.from({ length: totalPages }, (_, index) => index + 1).map(
          (number) => (
            <button
              className={page === number ? `active` : ``}
              onClick={() => setPage(number)}
              key={number}
            >
              {number}
            </button>
          ),
        )}
        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          ›
        </button>
      </div>

      {selected && (
        <div
          className="overlay"
          onMouseDown={(event) =>
            event.target === event.currentTarget && setSelected(null)
          }
        >
          <aside className="drawer course-analysis-drawer">
            <div className="drawer-head">
              <div>
                <span>과정 상세 분석</span>
                <h2>{selected.name}</h2>
              </div>
              <button onClick={() => setSelected(null)}>
                <Icon icon={Cancel01Icon} />
              </button>
            </div>
            <div className="detail-analysis-summary">
              <div>
                <span>수강</span>
                <b>{selected.learners}명</b>
              </div>
              <div>
                <span>수료율</span>
                <b>{selected.rate}%</b>
              </div>
              <div>
                <span>퀴즈</span>
                <b>{selected.quiz}점</b>
              </div>
            </div>
            <section>
              <h3>최근 6개월 수료율</h3>
              <div className="mini-trend-bars">
                {[
                  selected.rate - 12,
                  selected.rate - 9,
                  selected.rate - 7,
                  selected.rate - 5,
                  selected.rate - 2,
                  selected.rate,
                ].map((value, index) => (
                  <div key={index}>
                    <span style={{ height: `${value}%` }} />
                    <small>{index + 3}월</small>
                  </div>
                ))}
              </div>
            </section>
            <section>
              <h3>소속별 수료율</h3>
              {[
                [`개발팀`, selected.rate + 5],
                [`People팀`, selected.rate + 1],
                [`마케팅팀`, selected.rate - 4],
                [`세일즈팀`, selected.rate - 9],
              ].map(([name, value]) => (
                <div className="drawer-stat-row" key={name}>
                  <span>{name}</span>
                  <div>
                    <i style={{ width: `${Math.min(100, value)}%` }} />
                  </div>
                  <b>{value}%</b>
                </div>
              ))}
            </section>
            <div className="analysis-callout">
              <b>
                {selected.rate < 65
                  ? `수료 독려가 필요합니다.`
                  : `안정적으로 운영 중입니다.`}
              </b>
              <span>
                {selected.rate < 65
                  ? `미수료자 안내와 학습 기한 확인을 권장합니다.`
                  : `전월 대비 수료율이 꾸준히 유지되고 있습니다.`}
              </span>
            </div>
          </aside>
        </div>
      )}
    </section>
  );
}

function PerformanceAnalysis() {
  const [tab, setTab] = r.useState(`courses`);
  const [dept, setDept] = r.useState(`전체 소속`);
  const [position, setPosition] = r.useState(`전체 직급`);
  const [course, setCourse] = r.useState(`전체 과정`);
  const results = [
    {
      name: `개인정보보호 필수교육`,
      dept: `전체`,
      position: `전체`,
      learners: 214,
      complete: 188,
      incomplete: 26,
      rate: 88,
      likes: 142,
      quiz: 91,
      response: 86,
      satisfaction: 4.7,
    },
    {
      name: `생성형 AI 업무 활용`,
      dept: `개발팀`,
      position: `매니저`,
      learners: 126,
      complete: 99,
      incomplete: 27,
      rate: 79,
      likes: 126,
      quiz: 84,
      response: 74,
      satisfaction: 4.6,
    },
    {
      name: `데이터 분석 기초 입문`,
      dept: `마케팅팀`,
      position: `인턴`,
      learners: 84,
      complete: 57,
      incomplete: 27,
      rate: 68,
      likes: 87,
      quiz: 76,
      response: 69,
      satisfaction: 4.4,
    },
    {
      name: `처음 맡는 팀장을 위한 리더십`,
      dept: `People팀`,
      position: `팀장`,
      learners: 32,
      complete: 17,
      incomplete: 15,
      rate: 53,
      likes: 98,
      quiz: 72,
      response: 63,
      satisfaction: 4.3,
    },
  ];
  const filtered = results.filter(
    (item) =>
      (dept === `전체 소속` || item.dept === `전체` || item.dept === dept) &&
      (position === `전체 직급` ||
        item.position === `전체` ||
        item.position === position) &&
      (course === `전체 과정` || item.name === course),
  );
  return (
    <section className="performance-analysis-page">
      <div className="performance-filter-panel">
        <select value={dept} onChange={(event) => setDept(event.target.value)}>
          {[`전체 소속`, `People팀`, `개발팀`, `마케팅팀`, `운영팀`].map(
            (value) => (
              <option key={value}>{value}</option>
            ),
          )}
        </select>
        <select
          value={position}
          onChange={(event) => setPosition(event.target.value)}
        >
          {[`전체 직급`, `인턴`, `매니저`, `파트장`, `팀장`].map((value) => (
            <option key={value}>{value}</option>
          ))}
        </select>
        <select
          value={course}
          onChange={(event) => setCourse(event.target.value)}
        >
          <option>전체 과정</option>
          {results.map((item) => (
            <option key={item.name}>{item.name}</option>
          ))}
        </select>
        <button className="filter-search-button">검색</button>
        <button
          className="filter-reset"
          onClick={() => {
            setDept(`전체 소속`);
            setPosition(`전체 직급`);
            setCourse(`전체 과정`);
          }}
        >
          <Icon icon={RefreshIcon} />
          초기화
        </button>
      </div>
      <div className="performance-main-tabs">
        <button
          className={tab === `courses` ? `active` : ``}
          onClick={() => setTab(`courses`)}
        >
          과정별 성과
        </button>
        <button
          className={tab === `quiz` ? `active` : ``}
          onClick={() => setTab(`quiz`)}
        >
          퀴즈 결과
        </button>
        <button
          className={tab === `survey` ? `active` : ``}
          onClick={() => setTab(`survey`)}
        >
          설문 결과
        </button>
      </div>
      {tab === `courses` && (
        <>
          <div className="course-performance-chart panel">
            <div className="panel-head">
              <div>
                <h2>강의별 수강 현황</h2>
                <p>수료자와 미수료자를 함께 비교합니다.</p>
              </div>
              <div className="chart-legend">
                <span className="completion">수료</span>
                <span className="incomplete-legend">미수료</span>
              </div>
            </div>
            <div className="horizontal-course-chart">
              {filtered.map((item) => (
                <div key={item.name}>
                  <b>{item.name}</b>
                  <div>
                    <span
                      className="complete-segment"
                      style={{ width: `${item.rate}%` }}
                    ></span>
                    <span
                      className="incomplete-segment"
                      style={{ width: `${100 - item.rate}%` }}
                    ></span>
                  </div>
                  <strong>{item.rate}%</strong>
                  <small>
                    {item.complete} / {item.learners}명
                  </small>
                </div>
              ))}
            </div>
          </div>
          <div className="table-wrap performance-result-table">
            <table>
              <thead>
                <tr>
                  <th>교육과정</th>
                  <th>수강 인원</th>
                  <th>수료자</th>
                  <th>미수료자</th>
                  <th>수료율</th>
                  <th>좋아요</th>
                  <th>상세</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item.name}>
                    <td>
                      <b>{item.name}</b>
                    </td>
                    <td>{item.learners}명</td>
                    <td className="complete-number">{item.complete}명</td>
                    <td className="incomplete-number">{item.incomplete}명</td>
                    <td>
                      <strong>{item.rate}%</strong>
                    </td>
                    <td>
                      <span className="like-stat">
                        <Icon icon={ThumbsUpIcon} size={14} />
                        {item.likes}
                      </span>
                    </td>
                    <td>
                      <button className="detail">상세보기</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
      {tab === `quiz` && (
        <div className="table-wrap performance-result-table">
          <table>
            <thead>
              <tr>
                <th>교육과정</th>
                <th>응시 인원</th>
                <th>평균 점수</th>
                <th>최고 점수</th>
                <th>완료율</th>
                <th>결과</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.name}>
                  <td>
                    <b>{item.name}</b>
                  </td>
                  <td>{Math.round(item.learners * 0.82)}명</td>
                  <td>
                    <strong>{item.quiz}점</strong>
                  </td>
                  <td>{Math.min(100, item.quiz + 12)}점</td>
                  <td>{Math.round(item.rate * 0.92)}%</td>
                  <td>
                    <button className="detail">응시 결과 보기</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {tab === `survey` && (
        <div className="survey-result-grid">
          {filtered.map((item) => (
            <article className="panel compact-survey-result" key={item.name}>
              <div>
                <span>{item.response}% 응답</span>
                <b>{item.name}</b>
              </div>
              <strong>
                {item.satisfaction}
                <small>/ 5</small>
              </strong>
              <div className="survey-response-bar">
                <i style={{ width: `${item.response}%` }} />
              </div>
              <button className="secondary">답변 조회</button>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

function RankingBadgeDashboard() {
  const [tab, setTab] = r.useState(`ranking`);
  const [period, setPeriod] = r.useState(`월간`);
  const [badges, setBadges] = r.useState([
    {
      id: 1,
      icon: Medal01Icon,
      tone: `gold`,
      name: `이달의 학습 TOP 3`,
      condition: `월간 학습 점수 상위 3명`,
      issued: 3,
      active: true,
    },
    {
      id: 2,
      icon: Award01Icon,
      tone: `blue`,
      name: `수료 마스터`,
      condition: `교육과정 5개 이상 수료`,
      issued: 18,
      active: true,
    },
    {
      id: 3,
      icon: CheckmarkCircle02Icon,
      tone: `green`,
      name: `필수교육 완료`,
      condition: `필수교육 전체 수료`,
      issued: 164,
      active: true,
    },
    {
      id: 4,
      icon: SparklesIcon,
      tone: `violet`,
      name: `꾸준한 학습자`,
      condition: `7일 연속 학습`,
      issued: 24,
      active: false,
    },
  ]);
  const ranking = [
    {
      rank: 1,
      name: `이지은`,
      dept: `마케팅팀`,
      score: 1280,
      completed: 9,
      minutes: 742,
    },
    {
      rank: 2,
      name: `정유진`,
      dept: `운영팀`,
      score: 1160,
      completed: 8,
      minutes: 695,
    },
    {
      rank: 3,
      name: `김지수`,
      dept: `People팀`,
      score: 1040,
      completed: 7,
      minutes: 641,
    },
    {
      rank: 4,
      name: `최하늘`,
      dept: `세일즈팀`,
      score: 920,
      completed: 6,
      minutes: 582,
    },
    {
      rank: 5,
      name: `박서준`,
      dept: `개발팀`,
      score: 870,
      completed: 6,
      minutes: 544,
    },
  ];
  const toggleBadge = (id) =>
    setBadges((items) =>
      items.map((item) =>
        item.id === id ? { ...item, active: !item.active } : item,
      ),
    );
  return (
    <section className="reward-management-page">
      <div className="performance-main-tabs reward-tabs">
        <button
          className={tab === `ranking` ? `active` : ``}
          onClick={() => setTab(`ranking`)}
        >
          학습자 랭킹
        </button>
        <button
          className={tab === `badges` ? `active` : ``}
          onClick={() => setTab(`badges`)}
        >
          뱃지 관리
        </button>
      </div>
      {tab === `ranking` ? (
        <>
          <div className="ranking-toolbar">
            <div>
              <button
                className={period === `월간` ? `active` : ``}
                onClick={() => setPeriod(`월간`)}
              >
                월간
              </button>
              <button
                className={period === `연간` ? `active` : ``}
                onClick={() => setPeriod(`연간`)}
              >
                연간
              </button>
            </div>
            <select>
              <option>2026년 8월</option>
              <option>2026년 7월</option>
            </select>
          </div>
          <div className="ranking-podium">
            {ranking.slice(0, 3).map((person) => (
              <article
                className={`podium-card rank-${person.rank}`}
                key={person.rank}
              >
                <span className={`podium-medal medal-${person.rank}`}>
                  <Icon icon={Medal01Icon} size={30} />
                </span>
                <div className="podium-avatar">{person.name[0]}</div>
                <em>{person.rank}위</em>
                <h3>{person.name}</h3>
                <p>{person.dept}</p>
                <strong>{person.score.toLocaleString()}점</strong>
                <small>
                  수료 {person.completed}개 · 학습 {person.minutes}분
                </small>
              </article>
            ))}
          </div>
          <div className="panel ranking-full-list">
            <div className="panel-head">
              <div>
                <h2>{period} 학습 랭킹</h2>
                <p>학습 시간·수료·퀴즈 점수를 합산합니다.</p>
              </div>
            </div>
            {ranking.map((person) => (
              <div
                className={`home-rank-row ${person.rank <= 3 ? `medal-${person.rank}` : ``}`}
                key={person.rank}
              >
                <span>
                  {person.rank <= 3 ? (
                    <Icon icon={Medal01Icon} size={22} />
                  ) : (
                    person.rank
                  )}
                </span>
                <div>
                  <b>{person.name}</b>
                  <small>
                    {person.dept} · 수료 {person.completed}개
                  </small>
                </div>
                <em>{person.minutes}분</em>
                <strong>{person.score.toLocaleString()}점</strong>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="badge-management-head">
            <div>
              <b>자동 지급 뱃지</b>
              <span>조건 달성 시 매일 자동으로 지급됩니다.</span>
            </div>
            <button className="primary">
              <Icon icon={Add01Icon} />새 뱃지 만들기
            </button>
          </div>
          <div className="badge-management-grid">
            {badges.map((badge) => (
              <article className="badge-management-card" key={badge.id}>
                <div className={`managed-badge-icon ${badge.tone}`}>
                  <Icon icon={badge.icon} size={25} />
                </div>
                <div className="managed-badge-copy">
                  <span>{badge.active ? `사용 중` : `사용 안 함`}</span>
                  <h3>{badge.name}</h3>
                  <p>{badge.condition}</p>
                  <small>지급 {badge.issued}명</small>
                </div>
                <button
                  className={badge.active ? `rule-switch on` : `rule-switch`}
                  onClick={() => toggleBadge(badge.id)}
                >
                  <i />
                </button>
                <div className="managed-badge-actions">
                  <button className="secondary">
                    <Icon icon={Edit02Icon} />
                    기준 수정
                  </button>
                  <button title="삭제">
                    <Icon icon={Delete02Icon} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </>
      )}
    </section>
  );
}

function PerformanceDashboard() {
  const [view, setView] = r.useState(`courses`);
  const [badgeOpen, setBadgeOpen] = r.useState(false);
  const [saved, setSaved] = r.useState(false);
  const [rules, setRules] = r.useState({
    enabled: true,
    monthlyTop: true,
    completions: true,
    completionCount: 5,
    mandatory: true,
    streak: false,
    streakDays: 7,
  });
  const courseResults = [
    {
      name: `개인정보보호 필수교육`,
      learners: 214,
      progress: 91,
      completion: 88,
      quiz: 86,
      satisfaction: 4.7,
    },
    {
      name: `생성형 AI 업무 활용`,
      learners: 126,
      progress: 82,
      completion: 79,
      quiz: 84,
      satisfaction: 4.6,
    },
    {
      name: `데이터 분석 기초 입문`,
      learners: 84,
      progress: 74,
      completion: 68,
      quiz: 77,
      satisfaction: 4.4,
    },
    {
      name: `처음 맡는 팀장을 위한 리더십`,
      learners: 32,
      progress: 61,
      completion: 53,
      quiz: 72,
      satisfaction: 4.3,
    },
  ];
  const incomplete = o
    .filter((_, index) => index % 2 === 0)
    .map((learner, index) => ({
      ...learner,
      course: [
        `개인정보보호 필수교육`,
        `데이터 분석 기초 입문`,
        `생성형 AI 업무 활용`,
      ][index],
      deadline: [`D-3`, `D-7`, `D-12`][index],
    }));
  const toggleRule = (key) =>
    setRules((current) => ({ ...current, [key]: !current[key] }));
  const saveRules = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  return (
    <section className="performance-dashboard">
      <div className="performance-toolbar">
        <div className="performance-period">
          <button className="active">최근 3개월</button>
          <button>최근 6개월</button>
          <button>올해</button>
        </div>
        <button
          className="secondary badge-rule-button"
          onClick={() => setBadgeOpen(true)}
        >
          <Icon icon={Award01Icon} />
          뱃지 지급 기준
        </button>
      </div>

      <div className="performance-kpis">
        {[
          [`전체 학습 참여`, `412건`, `전월 대비 8.4% 증가`],
          [`평균 진도율`, `76.4%`, `진행 중 과정 포함`],
          [`전체 수료율`, `78.2%`, `전월 대비 4.2% 상승`],
          [`관리 필요`, `21명`, `기한 임박 미수료자`],
        ].map(([label, value, detail], index) => (
          <div className={index === 3 ? `attention` : ``} key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
            <small>{detail}</small>
          </div>
        ))}
      </div>

      <div className="performance-overview-grid">
        <article className="panel performance-chart-panel">
          <div className="panel-head">
            <div>
              <h2>월별 학습 성과</h2>
              <p>참여 인원과 수료율의 최근 흐름입니다.</p>
            </div>
            <div className="chart-legend">
              <span className="learners">학습 참여</span>
              <span className="completion">수료율</span>
            </div>
          </div>
          <div
            className="performance-bars"
            aria-label="3월부터 8월까지 학습 성과 그래프"
          >
            {[55, 64, 61, 72, 78, 86].map((height, index) => (
              <div key={index}>
                <span
                  className="participation-bar"
                  style={{ height: `${height}%` }}
                >
                  <i>{[118, 146, 137, 182, 205, 228][index]}</i>
                </span>
                <span
                  className="completion-bar"
                  style={{ height: `${[65, 69, 71, 74, 76, 78][index]}%` }}
                ></span>
                <small>{index + 3}월</small>
              </div>
            ))}
          </div>
        </article>
        <article className="panel performance-focus">
          <div className="panel-head">
            <div>
              <h2>이번 달 핵심 요약</h2>
              <p>별도 관리 페이지 없이 참고 지표만 확인합니다.</p>
            </div>
          </div>
          <div className="focus-row">
            <span>만족도</span>
            <b>4.5 / 5</b>
            <small>설문 186건</small>
          </div>
          <div className="focus-row">
            <span>평균 퀴즈 점수</span>
            <b>81점</b>
            <small>응시 274건</small>
          </div>
          <div className="focus-row">
            <span>가장 인기 있는 과정</span>
            <b>생성형 AI 업무 활용</b>
            <small>좋아요 96개</small>
          </div>
          <div className="focus-row">
            <span>자동 지급 뱃지</span>
            <b>18개</b>
            <small>이달의 TOP 3 포함</small>
          </div>
        </article>
      </div>

      <div className="performance-section-head">
        <div>
          <h2>성과 상세</h2>
          <p>과정 성과와 관리가 필요한 학습자만 구분해 확인하세요.</p>
        </div>
        <div className="performance-tabs">
          <button
            className={view === `courses` ? `active` : ``}
            onClick={() => setView(`courses`)}
          >
            과정별 성과
          </button>
          <button
            className={view === `incomplete` ? `active` : ``}
            onClick={() => setView(`incomplete`)}
          >
            미수료자 <i>21</i>
          </button>
        </div>
      </div>

      {view === `courses` ? (
        <div className="table-wrap performance-table">
          <table>
            <thead>
              <tr>
                <th>교육과정</th>
                <th>학습자</th>
                <th>평균 진도율</th>
                <th>수료율</th>
                <th>퀴즈</th>
                <th>만족도</th>
                <th>상세</th>
              </tr>
            </thead>
            <tbody>
              {courseResults.map((course) => (
                <tr key={course.name}>
                  <td>
                    <b>{course.name}</b>
                  </td>
                  <td>{course.learners}명</td>
                  <td>
                    <div className="compact-progress">
                      <span style={{ width: `${course.progress}%` }}></span>
                    </div>
                    <small>{course.progress}%</small>
                  </td>
                  <td>
                    <strong>{course.completion}%</strong>
                  </td>
                  <td>{course.quiz}점</td>
                  <td>{course.satisfaction}</td>
                  <td>
                    <button className="detail">상세보기</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="table-wrap performance-table">
          <table>
            <thead>
              <tr>
                <th>학습자</th>
                <th>소속·직급</th>
                <th>미수료 과정</th>
                <th>진도율</th>
                <th>학습 기한</th>
                <th>관리</th>
              </tr>
            </thead>
            <tbody>
              {incomplete.map((learner) => (
                <tr key={learner.id}>
                  <td>
                    <b>{learner.name}</b>
                    <small>{learner.id}</small>
                  </td>
                  <td>
                    {learner.dept} · {learner.position}
                  </td>
                  <td>{learner.course}</td>
                  <td>
                    <strong>{learner.progress}%</strong>
                  </td>
                  <td>
                    <span className="deadline-badge">{learner.deadline}</span>
                  </td>
                  <td>
                    <button className="detail">안내 보내기</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {badgeOpen && (
        <div
          className="overlay"
          onMouseDown={(event) =>
            event.target === event.currentTarget && setBadgeOpen(false)
          }
        >
          <aside className="drawer badge-rule-drawer">
            <div className="drawer-head">
              <div>
                <span>자동 리워드 설정</span>
                <h2>뱃지 지급 기준</h2>
                <p>조건을 달성하면 시스템이 자동으로 뱃지를 지급합니다.</p>
              </div>
              <button onClick={() => setBadgeOpen(false)} aria-label="닫기">
                <Icon icon={Cancel01Icon} />
              </button>
            </div>
            <div className="badge-master">
              <div>
                <b>뱃지 자동 지급</b>
                <span>설정한 조건을 매일 자동으로 확인합니다.</span>
              </div>
              <button
                className={rules.enabled ? `rule-switch on` : `rule-switch`}
                onClick={() => toggleRule(`enabled`)}
              >
                <i />
              </button>
            </div>
            <div
              className={
                rules.enabled ? `badge-rule-list` : `badge-rule-list disabled`
              }
            >
              <BadgeRule
                title="이달의 학습 TOP 3"
                description="월간 학습 점수가 높은 3명에게 지급"
                enabled={rules.monthlyTop}
                onToggle={() => toggleRule(`monthlyTop`)}
              />
              <BadgeRule
                title="수료 마스터"
                description="설정한 개수 이상의 과정을 수료하면 지급"
                enabled={rules.completions}
                onToggle={() => toggleRule(`completions`)}
              >
                <label>
                  <input
                    type="number"
                    min="1"
                    value={rules.completionCount}
                    onChange={(event) =>
                      setRules({
                        ...rules,
                        completionCount: event.target.value,
                      })
                    }
                  />
                  개 과정
                </label>
              </BadgeRule>
              <BadgeRule
                title="필수교육 완료"
                description="배정된 필수교육을 모두 수료하면 지급"
                enabled={rules.mandatory}
                onToggle={() => toggleRule(`mandatory`)}
              />
              <BadgeRule
                title="연속 학습"
                description="설정한 기간 동안 매일 학습하면 지급"
                enabled={rules.streak}
                onToggle={() => toggleRule(`streak`)}
              >
                <label>
                  <input
                    type="number"
                    min="2"
                    value={rules.streakDays}
                    onChange={(event) =>
                      setRules({ ...rules, streakDays: event.target.value })
                    }
                  />
                  일 연속
                </label>
              </BadgeRule>
            </div>
            <div className="badge-rule-guide">
              <Icon icon={CheckmarkCircle02Icon} />
              <p>
                <b>지급된 뱃지는 어디에서 확인하나요?</b>
                <span>
                  관리자는 학습자 상세에서, 직원은 홈과 프로필에서 확인할 수
                  있습니다.
                </span>
              </p>
            </div>
            <div className="drawer-actions">
              <span className={saved ? `save-confirm visible` : `save-confirm`}>
                저장되었습니다.
              </span>
              <button className="secondary" onClick={() => setBadgeOpen(false)}>
                취소
              </button>
              <button className="primary" onClick={saveRules}>
                저장
              </button>
            </div>
          </aside>
        </div>
      )}
    </section>
  );
}

function BadgeRule({ title, description, enabled, onToggle, children }) {
  return (
    <div className="badge-rule">
      <div className="badge-rule-copy">
        <b>{title}</b>
        <span>{description}</span>
        {children}
      </div>
      <button
        className={enabled ? `rule-switch on` : `rule-switch`}
        onClick={onToggle}
      >
        <i />
      </button>
    </div>
  );
}

function S({ tab: e, setTab: t }) {
  let n = o.filter(
    (t, n) =>
      e === `전체` ||
      (e === `수료` && n % 2 == 0) ||
      (e === `미수료` && n % 2 == 1),
  );
  return (0, i.jsxs)(i.Fragment, {
    children: [
      (0, i.jsxs)(`div`, {
        className: `summary-strip`,
        children: [
          (0, i.jsxs)(`div`, {
            children: [
              (0, i.jsx)(`span`, { children: `전체 대상` }),
              (0, i.jsx)(`b`, { children: `248명` }),
            ],
          }),
          (0, i.jsxs)(`div`, {
            children: [
              (0, i.jsx)(`span`, { children: `수료` }),
              (0, i.jsx)(`b`, { className: `green-text`, children: `194명` }),
            ],
          }),
          (0, i.jsxs)(`div`, {
            children: [
              (0, i.jsx)(`span`, { children: `미수료` }),
              (0, i.jsx)(`b`, { className: `red-text`, children: `54명` }),
            ],
          }),
          (0, i.jsxs)(`div`, {
            children: [
              (0, i.jsx)(`span`, { children: `전체 수료율` }),
              (0, i.jsx)(`b`, { children: `78.2%` }),
            ],
          }),
        ],
      }),
      (0, i.jsxs)(`section`, {
        className: `panel`,
        children: [
          (0, i.jsx)(`div`, {
            className: `sub-tabs`,
            children: [`전체`, `수료`, `미수료`].map((n) =>
              (0, i.jsxs)(
                `button`,
                {
                  className: e === n ? `active` : ``,
                  onClick: () => t(n),
                  children: [
                    n,
                    n === `미수료` && (0, i.jsx)(`i`, { children: `54` }),
                  ],
                },
                n,
              ),
            ),
          }),
          (0, i.jsx)(m, { learner: !0 }),
          (0, i.jsx)(`div`, {
            className: `table-wrap`,
            children: (0, i.jsxs)(`table`, {
              children: [
                (0, i.jsx)(`thead`, {
                  children: (0, i.jsxs)(`tr`, {
                    children: [
                      (0, i.jsx)(`th`, { children: `학습자` }),
                      (0, i.jsx)(`th`, { children: `교육과정` }),
                      (0, i.jsx)(`th`, { children: `진도율` }),
                      (0, i.jsx)(`th`, { children: `설문` }),
                      (0, i.jsx)(`th`, { children: `수료 상태` }),
                      (0, i.jsx)(`th`, { children: `관리` }),
                    ],
                  }),
                }),
                (0, i.jsx)(`tbody`, {
                  children: n.map((e, t) =>
                    (0, i.jsxs)(
                      `tr`,
                      {
                        children: [
                          (0, i.jsxs)(`td`, {
                            children: [
                              (0, i.jsx)(`b`, { children: e.name }),
                              (0, i.jsx)(`small`, { children: e.dept }),
                            ],
                          }),
                          (0, i.jsx)(`td`, { children: a[t % a.length].title }),
                          (0, i.jsx)(`td`, {
                            children: t % 2 == 0 ? `100%` : e.progress + `%`,
                          }),
                          (0, i.jsx)(`td`, {
                            children: t % 2 == 0 ? `제출` : `미제출`,
                          }),
                          (0, i.jsx)(`td`, {
                            children:
                              t % 2 == 0
                                ? (0, i.jsx)(u, {
                                    tone: `green`,
                                    children: `수료`,
                                  })
                                : (0, i.jsx)(u, {
                                    tone: `red`,
                                    children: `미수료`,
                                  }),
                          }),
                          (0, i.jsx)(`td`, {
                            children: (0, i.jsx)(`button`, {
                              className: `detail`,
                              children:
                                t % 2 == 0 ? `수료증 확인` : `알림 보내기`,
                            }),
                          }),
                        ],
                      },
                      e.id,
                    ),
                  ),
                }),
              ],
            }),
          }),
        ],
      }),
    ],
  });
}
function Qe({ type: e }) {
  const ranking = [
    {
      rank: 1,
      name: `이지은`,
      dept: `마케팅팀`,
      completed: 9,
      minutes: 742,
      score: 1280,
    },
    {
      rank: 2,
      name: `정유진`,
      dept: `운영팀`,
      completed: 8,
      minutes: 695,
      score: 1160,
    },
    {
      rank: 3,
      name: `김수민`,
      dept: `People팀`,
      completed: 7,
      minutes: 641,
      score: 1040,
    },
    {
      rank: 4,
      name: `최하늘`,
      dept: `세일즈팀`,
      completed: 6,
      minutes: 582,
      score: 920,
    },
  ];
  const popular = [
    { title: `생성형 AI 업무 활용`, likes: 126, learners: 138, rate: 91 },
    {
      title: `처음 맡는 팀장을 위한 리더십`,
      likes: 98,
      learners: 112,
      rate: 87,
    },
    { title: `데이터 분석 기초 입문`, likes: 87, learners: 84, rate: 78 },
  ];
  const quizzes = [
    {
      title: `생성형 AI 업무 활용`,
      lessons: 5,
      participants: 96,
      average: 84,
      status: `운영 중`,
    },
    {
      title: `개인정보보호 필수교육`,
      lessons: 4,
      participants: 181,
      average: 91,
      status: `운영 중`,
    },
    {
      title: `데이터 분석 기초 입문`,
      lessons: 3,
      participants: 62,
      average: 76,
      status: `초안`,
    },
  ];
  if (e === `ranking`)
    return (
      <section className="admin-data-page">
        <div className="reward-summary">
          <div>
            <span>월간 랭킹 기준</span>
            <b>학습 시간 40% + 수료 40% + 퀴즈 20%</b>
          </div>
          <div>
            <span>연간 TOP 3 리워드</span>
            <b>약 50만 원 상당 상품</b>
          </div>
          <button className="primary">리워드 기준 설정</button>
        </div>
        <div className="panel">
          <div className="admin-data-head">
            <div>
              <h2>8월 학습 랭킹</h2>
              <p>매일 자정 학습 데이터를 기준으로 갱신됩니다.</p>
            </div>
            <select>
              <option>2026년 8월</option>
              <option>2026년 7월</option>
            </select>
          </div>
          <div className="ranking-admin-list">
            {ranking.map((person) => (
              <div
                className={"ranking-admin-row rank-" + person.rank}
                key={person.rank}
              >
                <span
                  className={
                    person.rank <= 3 ? `admin-medal medal-${person.rank}` : ``
                  }
                >
                  {person.rank <= 3 ? (
                    <Icon icon={Medal01Icon} size={25} />
                  ) : (
                    person.rank
                  )}
                </span>
                <div>
                  <b>{person.name}</b>
                  <small>{person.dept}</small>
                </div>
                <em>수료 {person.completed}개</em>
                <em>학습 {person.minutes}분</em>
                <strong>{person.score.toLocaleString()}점</strong>
                {person.rank <= 3 && <i>TOP {person.rank} 뱃지</i>}
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  if (e === `engagement`)
    return (
      <section className="admin-data-page">
        <div className="admin-data-summary">
          <div>
            <span>전체 좋아요</span>
            <b>428</b>
            <small>전월 대비 +18%</small>
          </div>
          <div>
            <span>좋아요 참여자</span>
            <b>196명</b>
            <small>전체 학습자의 79%</small>
          </div>
          <div>
            <span>인기 강의 평균 수료율</span>
            <b>85.3%</b>
            <small>전체 평균보다 +7.1%</small>
          </div>
        </div>
        <div className="panel">
          <div className="admin-data-head">
            <div>
              <h2>현재 인기 강의</h2>
              <p>좋아요 수와 수강자 수를 종합해 정렬했습니다.</p>
            </div>
          </div>
          <div className="popular-admin-list">
            {popular.map((course, index) => (
              <div key={course.title}>
                <span>{index + 1}</span>
                <div>
                  <b>{course.title}</b>
                  <small>
                    <Icon icon={ThumbsUpIcon} size={14} />
                    {course.likes} · 수강자 {course.learners}명
                  </small>
                </div>
                <div className="popularity-bar">
                  <i style={{ width: course.rate + `%` }} />
                </div>
                <strong>{course.rate}점</strong>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  return (
    <section className="admin-data-page">
      <div className="admin-data-summary">
        <div>
          <span>운영 중 퀴즈</span>
          <b>9개</b>
          <small>3개 교육과정</small>
        </div>
        <div>
          <span>이번 달 응시</span>
          <b>339건</b>
          <small>응시율 82%</small>
        </div>
        <div>
          <span>평균 정답률</span>
          <b>84%</b>
          <small>전월 대비 +4%</small>
        </div>
      </div>
      <div className="panel">
        <div className="admin-data-head">
          <div>
            <h2>강의별 퀴즈 현황</h2>
            <p>AI 자동 생성 또는 직접 등록한 퀴즈를 관리합니다.</p>
          </div>
          <button className="primary">
            <Icon icon={Add01Icon} />
            퀴즈 만들기
          </button>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>교육과정</th>
                <th>퀴즈</th>
                <th>응시자</th>
                <th>평균 점수</th>
                <th>상태</th>
                <th>관리</th>
              </tr>
            </thead>
            <tbody>
              {quizzes.map((quiz) => (
                <tr key={quiz.title}>
                  <td>
                    <b>{quiz.title}</b>
                  </td>
                  <td>{quiz.lessons}개</td>
                  <td>{quiz.participants}명</td>
                  <td>{quiz.average}점</td>
                  <td>
                    {u({
                      tone: quiz.status === `운영 중` ? `green` : `gray`,
                      children: quiz.status,
                    })}
                  </td>
                  <td>
                    <button className="detail">설정</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
function C() {
  return (0, i.jsx)(`section`, {
    className: `card-grid`,
    children: a.slice(0, 3).map((e, t) =>
      (0, i.jsxs)(
        `article`,
        {
          className: `survey-card`,
          children: [
            (0, i.jsxs)(`div`, {
              children: [
                (0, i.jsx)(u, {
                  tone: t === 2 ? `gray` : `mint`,
                  children: t === 2 ? `임시저장` : `진행 중`,
                }),
                (0, i.jsx)(`button`, { children: `⋮` }),
              ],
            }),
            (0, i.jsxs)(`h3`, { children: [e.title, ` 만족도 설문`] }),
            (0, i.jsx)(`p`, {
              children: `교육 내용과 운영에 대한 만족도를 조사합니다.`,
            }),
            (0, i.jsxs)(`div`, {
              className: `survey-stats`,
              children: [
                (0, i.jsxs)(`span`, {
                  children: [
                    (0, i.jsx)(`b`, { children: [62, 28, 0][t] }),
                    `응답`,
                  ],
                }),
                (0, i.jsxs)(`span`, {
                  children: [
                    (0, i.jsxs)(`b`, { children: [[74, 88, 0][t], `%`] }),
                    `응답률`,
                  ],
                }),
                (0, i.jsxs)(`span`, {
                  children: [
                    (0, i.jsx)(`b`, { children: [4.6, 4.3, `-`][t] }),
                    `평균`,
                  ],
                }),
              ],
            }),
            (0, i.jsx)(`button`, {
              className: `secondary full`,
              children: `응답 결과 보기`,
            }),
          ],
        },
        e.id,
      ),
    ),
  });
}
function w() {
  return (0, i.jsxs)(i.Fragment, {
    children: [
      (0, i.jsxs)(`div`, {
        className: `period-bar`,
        children: [
          (0, i.jsx)(`b`, { children: `조회 기간` }),
          (0, i.jsx)(`button`, { children: `최근 1개월` }),
          (0, i.jsx)(`button`, { className: `on`, children: `최근 3개월` }),
          (0, i.jsx)(`button`, { children: `최근 6개월` }),
          (0, i.jsx)(`button`, { children: `직접 설정` }),
          (0, i.jsx)(`span`, { children: `2026.05.01 — 2026.08.06` }),
        ],
      }),
      (0, i.jsx)(`section`, {
        className: `metric-grid`,
        children: [
          [`총 학습 참여`, `412건`],
          [`평균 진도율`, `76.4%`],
          [`평균 수료율`, `78.2%`],
          [`평균 만족도`, `4.5 / 5`],
        ].map((e) =>
          (0, i.jsxs)(
            `article`,
            {
              className: `metric`,
              children: [
                (0, i.jsx)(`span`, { children: e[0] }),
                (0, i.jsx)(`strong`, { children: e[1] }),
                (0, i.jsx)(`small`, { children: `이전 기간 대비 상승` }),
              ],
            },
            e[0],
          ),
        ),
      }),
      (0, i.jsxs)(`div`, {
        className: `dashboard-grid`,
        children: [
          (0, i.jsxs)(`article`, {
            className: `panel wide`,
            children: [
              (0, i.jsx)(`div`, {
                className: `panel-head`,
                children: (0, i.jsx)(`h2`, { children: `월별 학습 참여 추이` }),
              }),
              (0, i.jsx)(`div`, {
                className: `bar-chart`,
                children: [42, 58, 51, 73, 66, 86].map((e, t) =>
                  (0, i.jsxs)(
                    `div`,
                    {
                      children: [
                        (0, i.jsx)(`span`, {
                          className:
                            e >= 80
                              ? `bar-high`
                              : e >= 60
                                ? `bar-middle`
                                : `bar-low`,
                          style: { height: `${e}%` },
                        }),
                        (0, i.jsxs)(`small`, { children: [t + 3, `월`] }),
                      ],
                    },
                    t,
                  ),
                ),
              }),
            ],
          }),
          (0, i.jsxs)(`article`, {
            className: `panel`,
            children: [
              (0, i.jsx)(`div`, {
                className: `panel-head`,
                children: (0, i.jsx)(`h2`, { children: `분야별 수료율` }),
              }),
              [
                [`법정필수`, 92],
                [`AX`, 81],
                [`직무역량`, 76],
                [`리더십`, 68],
              ].map((e) =>
                (0, i.jsxs)(
                  `div`,
                  {
                    className: `stat-row`,
                    children: [
                      (0, i.jsx)(`span`, { children: e[0] }),
                      (0, i.jsx)(d, { value: e[1] }),
                      (0, i.jsxs)(`b`, { children: [e[1], `%`] }),
                    ],
                  },
                  e[0],
                ),
              ),
            ],
          }),
        ],
      }),
    ],
  });
}
function emptyNoticeForm() {
  const start = new Date().toISOString().slice(0, 10);
  const endDate = new Date();
  endDate.setMonth(endDate.getMonth() + 1);
  return { id: null, category: `필수 안내`, title: ``, targetType: `전체 임직원`, departments: [], course: ``, start, end: endDate.toISOString().slice(0, 10), noEnd: false, important: false, content: ``, file: `` };
}

function T({ createSignal }) {
  const [notices, setNotices] = r.useState([]);
  const [query, setQuery] = r.useState(``);
  const [screen, setScreen] = r.useState(`list`);
  const [form, setForm] = r.useState(null);
  const [viewing, setViewing] = r.useState(null);
  const [deleteTarget, setDeleteTarget] = r.useState(null);
  const initialSignal = r.useRef(createSignal);
  const loadNotices = () => apiRequest(`/api/v1/admin/notices`).then(setNotices).catch(() => showAdminToast(`공지사항을 불러오지 못했습니다.`));
  r.useEffect(() => { loadNotices(); }, []);
  r.useEffect(() => {
    if (createSignal !== initialSignal.current) {
      initialSignal.current = createSignal;
      setForm(emptyNoticeForm());
      setScreen(`create`);
    }
  }, [createSignal]);
  const visible = notices.filter((notice) =>
    (!query || notice.title.toLowerCase().includes(query.toLowerCase())) &&
    true
  );
  const saveNotice = async () => {
    if (!form.title.trim()) return alert(`공지사항 제목을 입력해 주세요.`);
    if (!form.content.trim()) return alert(`공지 내용을 입력해 주세요.`);
    const editing = Boolean(form.id);
    const targetDetails = form.targetType === `부서 선택` ? form.departments : form.targetType === `교육과정 수강자` ? [form.course].filter(Boolean) : [];
    try {
      const saved = await apiRequest(editing ? `/api/v1/admin/notices/${form.id}` : `/api/v1/admin/notices`, { method: editing ? `PATCH` : `POST`, body: JSON.stringify({ category:form.category,title:form.title,targetType:form.targetType,targetDetails,start:form.start,end:form.noEnd || !form.end ? null : form.end,status:`PUBLISHED`,important:form.important,content:form.content,file:form.file || null }) });
      setNotices((current) => editing ? current.map((item) => item.id === form.id ? saved : item) : [saved, ...current]);
      setForm(null);
      setViewing(saved);
      setScreen(`list`);
      window.dispatchEvent(new CustomEvent(`sparkplus-notices-updated`));
      showAdminToast(editing ? `공지사항이 수정되었습니다.` : `공지사항이 등록되었습니다.`);
    } catch { showAdminToast(`공지사항을 저장하지 못했습니다.`); }
  };
  const editNotice = (notice) => { setForm({ ...emptyNoticeForm(), ...notice, start: notice.start?.replaceAll(`.`, `-`) || ``, end: notice.end?.replaceAll(`.`, `-`) || `` }); setScreen(`edit`); };
  const removeNotice = async (notice) => {
    try {
      await apiRequest(`/api/v1/admin/notices/${notice.id}`, { method: `DELETE` });
      setNotices((current) => current.filter((item) => item.id !== notice.id));
      setDeleteTarget(null);
      setViewing(null);
      setScreen(`list`);
      window.dispatchEvent(new CustomEvent(`sparkplus-notices-updated`));
      showAdminToast(`공지사항이 삭제되었습니다.`);
    } catch { showAdminToast(`공지사항을 삭제하지 못했습니다.`); }
  };
  if (screen === `create` || screen === `edit`) return <NoticeEditorPage form={form} setForm={setForm} onCancel={() => { setForm(null); setScreen(screen === `edit` ? `detail` : `list`); }} onSave={saveNotice} />;
  if (screen === `detail` && viewing) return <><NoticeDetailPage notice={viewing} onBack={() => setScreen(`list`)} onEdit={() => editNotice(viewing)} onDelete={() => setDeleteTarget(viewing)} />{deleteTarget && <NoticeDeleteDialog onCancel={() => setDeleteTarget(null)} onConfirm={() => removeNotice(deleteTarget)} />}</>;
  return (
    <section className="admin-notice-page">
      <PageHeader kicker="공지사항 관리" title="공지사항 관리" description="임직원에게 노출되는 공지사항을 등록하고 관리합니다." />
      <div className="notice-admin-search"><span><Icon icon={Search01Icon} size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="공지사항 제목을 검색해주세요" /></span><button className="primary">검색</button></div>
      <div className="notice-admin-summary"><h2>전체 공지 {notices.length}건</h2><button className="notice-create-button" onClick={() => { setForm(emptyNoticeForm()); setScreen(`create`); }}><Icon icon={Add01Icon} size={17} />공지사항 등록</button></div>
      <div className="notice-admin-table-wrap">
        <table className="notice-admin-table">
          <thead><tr><th>제목</th><th>게시 기간</th><th>조회수</th><th>삭제</th></tr></thead>
          <tbody>{visible.map((notice) => <tr className={notice.important ? `notice-important-row` : ``} key={notice.id}>
            <td><button className="notice-title-button" onClick={() => { setViewing(notice); setScreen(`detail`); }}>{notice.important && <NoticePin />}<b>{notice.title}</b></button></td>
            <td><span className="notice-period">{notice.start?.slice(5).replaceAll(`.`, `/`).replaceAll(`-`, `/`)} ~ {notice.end ? notice.end.slice(5).replaceAll(`.`, `/`).replaceAll(`-`, `/`) : `계속`}</span></td>
            <td>{notice.views.toLocaleString()}</td>
            <td className="notice-delete-cell"><button className="notice-delete-button" onClick={() => setDeleteTarget(notice)} aria-label={`${notice.title} 삭제`} title="공지 삭제"><Icon icon={Delete02Icon} size={18} /></button></td>
          </tr>)}</tbody>
        </table>
        {visible.length === 0 && <div className="notice-admin-empty">조건에 맞는 공지사항이 없습니다.</div>}
      </div>
      {deleteTarget && <NoticeDeleteDialog onCancel={() => setDeleteTarget(null)} onConfirm={() => removeNotice(deleteTarget)} />}
    </section>
  );
}

function NoticeEditorPage({ form, setForm, onCancel, onSave }) {
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  return <section className="notice-subpage">
    <PageHeader kicker={`공지사항 관리 › ${form.id ? `공지사항 수정` : `공지사항 등록`}`} title={form.id ? `공지사항 수정` : `공지사항 등록`} />
    <div className="notice-page-form">
      <label>공지 제목<input value={form.title} onChange={(event) => update(`title`, event.target.value)} placeholder="공지사항 제목을 입력해주세요" /></label>
      <label className="notice-important-check"><input type="checkbox" checked={form.important} onChange={(event) => update(`important`, event.target.checked)} /><span>중요 공지로 등록</span></label>
      <fieldset><legend>게시 기간</legend><div className="notice-page-dates"><input aria-label="게시 시작일" type="date" onClick={openNativeDatePicker} value={form.start} onChange={(event) => update(`start`, event.target.value)} /><span>~</span><input aria-label="게시 종료일" type="date" onClick={openNativeDatePicker} value={form.end} onChange={(event) => update(`end`, event.target.value)} /></div></fieldset>
      <label>공지 내용<textarea value={form.content} onChange={(event) => update(`content`, event.target.value)} placeholder="공지 내용을 입력해주세요." /></label>
      <div className="notice-page-actions"><button className="secondary" onClick={onCancel}>취소</button><button className="primary" onClick={onSave}>{form.id ? `저장` : `등록`}</button></div>
    </div>
  </section>;
}

function NoticeDetailPage({ notice, onBack, onEdit, onDelete }) {
  return <section className="notice-subpage">
    <PageHeader kicker="공지사항 관리 › 공지사항 상세" title="공지사항 상세" />
    <button className="notice-back-link" onClick={onBack}><Icon icon={ArrowLeft01Icon} size={16} />목록으로</button>
    <article className="notice-document">
      <header>{notice.important && <NoticePin label />}<h1>{notice.title}</h1><div><time>{notice.start?.replaceAll(`-`, `.`)}</time><span>조회수 {notice.views.toLocaleString()}</span></div></header>
      <div className="notice-document-body">{(notice.content || ``).split(`\n`).map((line, index) => <p key={index}>{line || <br />}</p>)}</div>
    </article>
    <div className="notice-detail-actions"><button className="secondary" onClick={onEdit}><Icon icon={Edit02Icon} size={17} />수정</button><button className="notice-danger-outline" onClick={onDelete}><Icon icon={Delete02Icon} size={17} />삭제</button></div>
  </section>;
}

function NoticeDeleteDialog({ onCancel, onConfirm }) {
  return <ConfirmModal title="공지사항을 삭제할까요?" description="삭제한 공지사항은 복구할 수 없습니다." confirmLabel="삭제" onCancel={onCancel} onConfirm={onConfirm} />;
}

function NoticeEditorModal({ form, setForm, onClose, onPreview, onDraft, onPublish }) {
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const departments = [`People팀`, `개발팀`, `마케팅팀`, `세일즈팀`, `운영팀`, `공간디자인팀`];
  return <div className="overlay center" onMouseDown={onClose}><section className="notice-editor-modal" onMouseDown={(event) => event.stopPropagation()}>
    <header><div><span>{form.id ? `공지 수정` : `새 공지`}</span><h2>{form.id ? `공지사항 수정` : `공지사항 등록`}</h2><p>노출 대상과 게시 기간을 설정해 정확한 안내를 전달하세요.</p></div><button onClick={onClose}><Icon icon={Cancel01Icon} /></button></header>
    <div className="notice-editor-scroll">
      <div className="notice-form-section"><h3>기본 정보</h3><div className="notice-form-grid"><label className="full">공지 제목<input value={form.title} onChange={(event) => update(`title`, event.target.value)} placeholder="공지사항 제목을 입력해주세요" /></label><label className="check-label"><input type="checkbox" checked={form.important} onChange={(event) => update(`important`, event.target.checked)} />중요 공지로 상단 고정</label></div></div>
      <div className="notice-form-section"><h3>게시 대상</h3><div className="notice-target-options">{[`전체 임직원`, `부서 선택`, `교육과정 수강자`].map((item) => <label key={item}><input type="radio" name="target" checked={form.targetType === item} onChange={() => update(`targetType`, item)} />{item}</label>)}</div>{form.targetType === `부서 선택` && <div className="department-checks">{departments.map((item) => <label key={item}><input type="checkbox" checked={form.departments.includes(item)} onChange={() => update(`departments`, form.departments.includes(item) ? form.departments.filter((value) => value !== item) : [...form.departments, item])} />{item}</label>)}</div>}{form.targetType === `교육과정 수강자` && <select className="notice-course-select" value={form.course} onChange={(event) => update(`course`, event.target.value)}>{a.map((course) => <option key={course.id}>{course.title}</option>)}</select>}</div>
      <div className="notice-form-section"><h3>게시 기간</h3><div className="notice-date-grid"><label>게시 시작<input type="date" onClick={openNativeDatePicker} value={form.start} onChange={(event) => update(`start`, event.target.value)} /></label><label>게시 종료<input type="date" onClick={openNativeDatePicker} value={form.end} disabled={form.noEnd} onChange={(event) => update(`end`, event.target.value)} /></label></div><label className="check-label inline"><input type="checkbox" checked={form.noEnd} onChange={(event) => update(`noEnd`, event.target.checked)} />종료일 없이 계속 게시</label></div>
      <div className="notice-form-section"><h3>공지 내용</h3><div className="notice-editor-toolbar"><button type="button"><b>B</b></button><button type="button">목록</button><button type="button"><Icon icon={File01Icon} size={15} /> 링크</button></div><textarea value={form.content} onChange={(event) => update(`content`, event.target.value)} placeholder="임직원에게 안내할 내용을 입력해주세요" /></div>
      <div className="notice-form-section"><h3>첨부파일</h3><label className="notice-file-upload"><Icon icon={Add01Icon} /><span>{form.file || `파일 첨부`}</span><input type="file" onChange={(event) => update(`file`, event.target.files?.[0]?.name || ``)} /></label></div>
    </div>
    <footer><button className="notice-preview-button" onClick={onPreview}>미리보기</button><div><button className="secondary" onClick={onDraft}>임시저장</button><button className="primary" onClick={onPublish}>게시하기</button></div></footer>
  </section></div>;
}

function NoticeReadingModal({ notice, preview = false, onClose, onEdit, onEnd }) {
  return <div className="overlay center" onMouseDown={onClose}><article className="notice-reading-modal" onMouseDown={(event) => event.stopPropagation()}>
    <header><span>{preview ? `사용자 화면 미리보기` : `공지 보기`}</span><button onClick={onClose}><Icon icon={Cancel01Icon} /></button></header>
    <div className="notice-reading-content">{notice.important && <NoticePin label />}<h1>{notice.title || `제목 없는 공지`}</h1><div className="notice-reading-meta"><span>게시 기간 {notice.start} ~ {notice.noEnd || !notice.end ? `계속` : notice.end}</span><span>게시 대상 {notice.target || `전체 임직원`}</span><span>조회 {notice.views || 0}</span></div><div className="notice-reading-body">{(notice.content || `공지 내용이 입력되지 않았습니다.`).split(`\n`).map((line, index) => <p key={index}>{line || <br />}</p>)}</div>{notice.file && <div className="notice-reading-file"><b>첨부파일</b><button><Icon icon={File01Icon} /><span>{notice.file}</span><Icon icon={Download01Icon} /></button></div>}</div>
    {!preview && <footer>{onEdit && <button className="secondary" onClick={onEdit}>수정</button>}{onEnd && <button className="primary" onClick={onEnd}>게시 종료</button>}</footer>}
  </article></div>;
}
function E() {
  let [e, t] = (0, r.useState)(`정보`);
  return (0, i.jsxs)(`div`, {
    className: `profile-page`,
    children: [
      (0, i.jsxs)(`aside`, {
        className: `profile-sidebar`,
        children: [
          (0, i.jsx)(`div`, { className: `large-avatar`, children: `관` }),
          (0, i.jsx)(`h3`, { children: `관리자` }),
          (0, i.jsx)(`p`, { children: `People팀 · LMS 운영자` }),
          (0, i.jsx)(`button`, {
            className: e === `정보` ? `on` : ``,
            onClick: () => t(`정보`),
            children: `프로필 수정`,
          }),
          (0, i.jsx)(`button`, {
            className: e === `비밀번호` ? `on` : ``,
            onClick: () => t(`비밀번호`),
            children: `비밀번호 변경`,
          }),
        ],
      }),
      (0, i.jsxs)(`section`, {
        className: `panel form-panel`,
        children: [
          (0, i.jsx)(`h2`, {
            children: e === `정보` ? `프로필 수정` : `비밀번호 변경`,
          }),
          (0, i.jsx)(`p`, {
            children:
              e === `정보`
                ? `관리자 계정의 기본 정보를 수정합니다.`
                : `계정 보호를 위해 안전한 비밀번호를 사용하세요.`,
          }),
          e === `정보`
            ? (0, i.jsxs)(`div`, {
                className: `form-grid`,
                children: [
                  (0, i.jsxs)(`label`, {
                    children: [
                      `이름`,
                      (0, i.jsx)(`input`, { defaultValue: `관리자` }),
                    ],
                  }),
                  (0, i.jsxs)(`label`, {
                    children: [
                      `소속`,
                      (0, i.jsx)(`input`, { defaultValue: `People팀` }),
                    ],
                  }),
                  (0, i.jsxs)(`label`, {
                    children: [
                      `이메일`,
                      (0, i.jsx)(`input`, {
                        defaultValue: `admin@sparkplus.co`,
                      }),
                    ],
                  }),
                  (0, i.jsxs)(`label`, {
                    children: [
                      `연락처`,
                      (0, i.jsx)(`input`, { defaultValue: `010-0000-0000` }),
                    ],
                  }),
                ],
              })
            : (0, i.jsxs)(`div`, {
                className: `password-form`,
                children: [
                  (0, i.jsxs)(`label`, {
                    children: [
                      `현재 비밀번호`,
                      (0, i.jsx)(`input`, { type: `password` }),
                    ],
                  }),
                  (0, i.jsxs)(`label`, {
                    children: [
                      `새 비밀번호`,
                      (0, i.jsx)(`input`, { type: `password` }),
                    ],
                  }),
                  (0, i.jsxs)(`label`, {
                    children: [
                      `새 비밀번호 확인`,
                      (0, i.jsx)(`input`, { type: `password` }),
                    ],
                  }),
                ],
              }),
          (0, i.jsxs)(`div`, {
            className: `form-actions`,
            children: [
              (0, i.jsx)(`button`, { className: `ghost`, children: `취소` }),
              (0, i.jsx)(`button`, {
                className: `primary`,
                children: `변경사항 저장`,
              }),
            ],
          }),
        ],
      }),
    ],
  });
}
function D({ title: e, onClose: t }) {
  return (0, i.jsx)(`div`, {
    className: `overlay center`,
    onMouseDown: t,
    children: (0, i.jsxs)(`div`, {
      className: `modal`,
      onMouseDown: (e) => e.stopPropagation(),
      children: [
        (0, i.jsxs)(`div`, {
          className: `drawer-head`,
          children: [
            (0, i.jsx)(`h2`, { children: e }),
            (0, i.jsx)(`button`, {
              onClick: t,
              children: (0, i.jsx)(Icon, { icon: Cancel01Icon }),
            }),
          ],
        }),
        (0, i.jsxs)(`div`, {
          className: `form-grid`,
          children: [
            (0, i.jsxs)(`label`, {
              children: [
                `과정/공지 제목`,
                (0, i.jsx)(`input`, { placeholder: `제목을 입력하세요` }),
              ],
            }),
            (0, i.jsxs)(`label`, {
              children: [
                `분류`,
                (0, i.jsxs)(`select`, {
                  children: [
                    (0, i.jsx)(`option`, { children: `직무역량` }),
                    (0, i.jsx)(`option`, { children: `리더십` }),
                    (0, i.jsx)(`option`, { children: `AX` }),
                  ],
                }),
              ],
            }),
            (0, i.jsxs)(`label`, {
              children: [`시작일`, (0, i.jsx)(`input`, { type: `date` })],
            }),
            (0, i.jsxs)(`label`, {
              children: [`종료일`, (0, i.jsx)(`input`, { type: `date` })],
            }),
          ],
        }),
        (0, i.jsxs)(`label`, {
          className: `block-label`,
          children: [
            `상세 내용`,
            (0, i.jsx)(`textarea`, { placeholder: `내용을 입력하세요` }),
          ],
        }),
        (0, i.jsxs)(`div`, {
          className: `form-actions`,
          children: [
            (0, i.jsx)(`button`, {
              className: `ghost`,
              onClick: t,
              children: `취소`,
            }),
            (0, i.jsx)(`button`, {
              className: `primary`,
              onClick: t,
              children: `저장`,
            }),
          ],
        }),
      ],
    }),
  });
}
var O = [
    {
      id: 1,
      category: `직무역량`,
      title: `데이터 분석 기초 입문: 실무에 바로 쓰는 핵심 전략`,
      description: `데이터를 읽고 업무 의사결정에 활용하는 가장 실용적인 입문 과정입니다.`,
      period: `2026.08.01 ~ 2026.09.30`,
      duration: `2시간 30분`,
      level: `레벨 1`,
      format: `온라인`,
      status: `운영 중`,
      accent: `blue`,
      instructor: `김현우 강사`,
      progress: 65,
      enrolled: !0,
    },
    {
      id: 2,
      category: `리더십`,
      title: `처음 맡는 팀장을 위한 리더십 기본`,
      description: `목표 설정부터 피드백까지, 신임 리더에게 필요한 핵심 역량을 익힙니다.`,
      period: `2026.08.18 ~ 2026.10.10`,
      duration: `4시간`,
      level: `레벨 2`,
      format: `혼합`,
      status: `오픈 전`,
      accent: `green`,
      instructor: `박서연 강사`,
    },
    {
      id: 3,
      category: `개발`,
      title: `React와 TypeScript로 시작하는 실전 프론트엔드 개발`,
      description: `최신 웹 개발 트렌드를 반영해 기초부터 작은 프로젝트까지 완성합니다.`,
      period: `2026.08.10 ~ 2026.10.31`,
      duration: `8시간`,
      level: `레벨 2`,
      format: `온라인`,
      status: `운영 중`,
      accent: `purple`,
      instructor: `이도윤 강사`,
    },
    {
      id: 4,
      category: `커뮤니케이션`,
      title: `협업을 바꾸는 비즈니스 커뮤니케이션`,
      description: `보고, 회의, 피드백 상황에서 명확하게 소통하는 방법을 학습합니다.`,
      period: `2026.09.01 ~ 2026.09.25`,
      duration: `3시간`,
      level: `레벨 1`,
      format: `오프라인`,
      status: `종료`,
      accent: `orange`,
      instructor: `최지민 강사`,
    },
    {
      id: 5,
      category: `법정의무`,
      title: `2026 개인정보보호 필수 교육`,
      description: `업무 중 반드시 알아야 할 개인정보 보호 원칙과 사고 대응 절차를 안내합니다.`,
      period: `2026.07.01 ~ 2026.08.22`,
      duration: `1시간`,
      level: `레벨 1`,
      format: `온라인`,
      status: `모집 마감`,
      accent: `red`,
      instructor: `준법지원팀`,
      progress: 30,
      enrolled: !0,
    },
    {
      id: 6,
      category: `AI·DX`,
      title: `업무 생산성을 높이는 생성형 AI 활용법`,
      description: `반복 업무를 줄이고 결과물의 품질을 높이는 프롬프트 작성법을 실습합니다.`,
      period: `2026.08.25 ~ 2026.10.15`,
      duration: `5시간`,
      level: `레벨 3`,
      format: `온라인`,
      status: `운영 중`,
      accent: `cyan`,
      instructor: `정유나 강사`,
    },
  ],
  k = {
    1: [
      { title: `데이터 기반 업무의 이해`, duration: `18분` },
      { title: `업무 문제를 데이터 질문으로 바꾸기`, duration: `24분` },
      { title: `실무 데이터 수집과 정리`, duration: `32분` },
      { title: `핵심 지표를 선정하고 해석하기`, duration: `28분` },
      { title: `데이터로 설득력 있게 보고하기`, duration: `35분` },
    ],
    2: [
      { title: `팀장이 된다는 것`, duration: `35분` },
      { title: `팀 목표와 역할 명확히 하기`, duration: `45분` },
      { title: `구성원의 강점을 살리는 업무 위임`, duration: `50분` },
      { title: `성과를 만드는 피드백 대화`, duration: `55분` },
      { title: `갈등 상황을 조율하는 리더의 원칙`, duration: `35분` },
    ],
    3: [
      { title: `React와 TypeScript 개발 환경 구성`, duration: `55분` },
      { title: `컴포넌트와 Props 설계`, duration: `70분` },
      { title: `상태 관리와 사용자 이벤트`, duration: `75분` },
      { title: `API 데이터 연동과 오류 처리`, duration: `80분` },
      { title: `실전 미니 프로젝트 완성`, duration: `120분` },
    ],
    4: [
      { title: `명확한 비즈니스 소통의 기본`, duration: `30분` },
      { title: `핵심이 보이는 보고와 문서 작성`, duration: `40분` },
      { title: `효율적인 회의 진행과 참여`, duration: `35분` },
      { title: `상대방을 움직이는 피드백`, duration: `45분` },
      { title: `협업 갈등을 해결하는 대화법`, duration: `30분` },
    ],
    5: [
      { title: `개인정보의 이해와 주요 원칙`, duration: `12분` },
      { title: `업무 단계별 개인정보 처리 기준`, duration: `15분` },
      { title: `개인정보 유출 사례와 예방`, duration: `13분` },
      { title: `사고 발생 시 대응 절차`, duration: `12분` },
      { title: `필수 확인 문제`, duration: `8분` },
    ],
    6: [
      { title: `생성형 AI와 업무 혁신`, duration: `40분` },
      { title: `좋은 결과를 만드는 프롬프트 구조`, duration: `55분` },
      { title: `문서 작성과 요약 업무 자동화`, duration: `60분` },
      { title: `데이터 분석 및 아이디어 도출 실습`, duration: `65분` },
      { title: `안전하고 책임감 있는 AI 활용`, duration: `40분` },
    ],
  },
  CURRENT_USER = {
    id: `SP1024`,
    name: `김지수`,
    department: `People팀`,
    position: `인턴`,
    email: `user@company.com`,
  },
  A = {
    user: [
      [`userDashboard`, `홈`],
      [`catalog`, `교육과정 조회`],
      [`learning`, `나의 학습`],
      [`userRewards`, `학습 리워드`],
      [`noticeList`, `공지사항`],
    ],
    admin: [
      [`adminDashboard`, `관리자 대시보드`],
      [`placeholder`, `교육과정 관리`],
      [`placeholder`, `학습자 관리`],
      [`placeholder`, `공지사항 관리`],
      [`placeholder`, `통계 및 리포트`],
    ],
  },
  j = [
    {
      id: 1,
      category: `교육 안내`,
      title: `2026년 하반기 법정의무교육 수강 안내`,
      writer: `인재개발팀`,
      date: `2026.08.04`,
      views: 248,
      important: !0,
      content: `2026년 하반기 법정의무교육 수강 일정을 안내드립니다. 전 임직원은 교육 기간 내 개인정보보호, 직장 내 괴롭힘 예방, 성희롱 예방 과정을 모두 수료해 주세요.`,
      file: `2026_하반기_법정의무교육_안내.pdf`,
    },
    {
      id: 2,
      category: `시스템`,
      title: `LMS 시스템 정기 점검 안내 (8/25)`,
      writer: `LMS 관리자`,
      date: `2026.08.01`,
      views: 132,
      important: !0,
      content: `안정적인 서비스 제공을 위해 8월 25일 오전 2시부터 4시까지 정기 점검이 진행됩니다. 점검 시간에는 학습 진도 저장이 제한될 수 있습니다.`,
      file: ``,
    },
    {
      id: 3,
      category: `과정 안내`,
      title: `8월 신규 교육과정 오픈 안내`,
      writer: `인재개발팀`,
      date: `2026.07.29`,
      views: 197,
      important: !1,
      content: `생성형 AI 활용법, 신임 리더 온보딩 등 8월 신규 교육과정이 오픈되었습니다. 교육과정 조회 메뉴에서 상세 내용을 확인해 주세요.`,
      file: `8월_신규과정_목록.pdf`,
    },
    {
      id: 4,
      category: `이벤트`,
      title: `상반기 학습 우수자 시상 및 경품 안내`,
      writer: `People팀`,
      date: `2026.07.24`,
      views: 315,
      important: !1,
      content: `상반기 동안 꾸준히 학습한 구성원을 대상으로 학습 우수자 시상을 진행합니다. 선정 결과와 경품 지급 일정은 첨부 안내를 확인해 주세요.`,
      file: `학습우수자_선정결과.pdf`,
    },
    {
      id: 5,
      category: `교육 안내`,
      title: `데이터 분석 실무 과정 교재 업데이트`,
      writer: `인재개발팀`,
      date: `2026.07.18`,
      views: 86,
      important: !1,
      content: `데이터 분석 실무 과정의 3차시 실습 교재가 업데이트되었습니다. 강의실의 첨부 자료에서 최신 파일을 내려받아 주세요.`,
      file: ``,
    },
  ];
function M() {
  let [theme, setTheme] = (0, r.useState)(
    () => localStorage.getItem(`sparkplus-theme`) || `light`,
  );
  (0, r.useEffect)(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(`sparkplus-theme`, theme);
  }, [theme]);
  let [e, t] = (0, r.useState)(`login`),
    [n, a] = (0, r.useState)(`user`),
    [o, s] = (0, r.useState)(!1),
    [p, m] = (0, r.useState)(``),
    [authLoading, setAuthLoading] = (0, r.useState)(!0),
    [authenticatedUser, setAuthenticatedUser] = (0, r.useState)(null),
    [h, g] = (0, r.useState)([]),
    [_, v] = (0, r.useState)(1),
    [y, b] = (0, r.useState)(``),
    [x, S] = (0, r.useState)(`전체 분야`),
    [C, w] = (0, r.useState)(`전체 레벨`),
    [T, E] = (0, r.useState)(`전체 상태`),
    [D, k] = (0, r.useState)({
      search: ``,
      category: `전체 분야`,
      level: `전체 레벨`,
      recruit: `전체 상태`,
    }),
    [A, M] = (0, r.useState)(null),
    [P, I] = (0, r.useState)(``),
    [R, z] = (0, r.useState)(!1),
    [B, V] = (0, r.useState)(!0),
    [H, W] = (0, r.useState)(!1),
    [G, q] = (0, r.useState)(38),
    [J, Y] = (0, r.useState)(1),
    [rewardInitialTab, setRewardInitialTab] = (0, r.useState)(`ranking`),
    [wishlistIds, setWishlistIds] = (0, r.useState)(() => O.filter((course) => localStorage.getItem(`sparkplus-wishlist-${course.id}`) === `true`).map((course) => course.id)),
    [userNotices, setUserNotices] = (0, r.useState)([]);
  const loadLearningCourses = () => apiRequest(`/api/v1/learning/courses`).then((items) => {
    g(items.map((course) => ({ ...course, enrolled:Boolean(course.enrollmentId), progress:Number(course.progress||0), totalLessons:Number(course.totalLessons||0), completedLessons:Number(course.completedLessons||0), requiredTraining:Boolean(course.required), assignmentDeadline:course.dueDate || ``, description:course.description || ``, status:`운영 중`, lessons:Number(course.totalLessons||0) })));
  });
  ((0, r.useEffect)(() => {
    loadLearningCourses().catch(() => {});
  }, []),
    (0, r.useEffect)(() => {
      let active = !0;
      fetch(`/api/v1/auth/me`, { credentials: `include`, headers: { Accept: `application/json` } })
        .then(async (response) => {
          if (!response.ok) return null;
          const result = await response.json();
          return result?.data?.user ?? null;
        })
        .then((user) => {
          if (!active || !user) return;
          const role = user.role === `ADMIN` ? `admin` : `user`;
          setAuthenticatedUser(user);
          a(role);
          t(role === `admin` ? `adminDashboard` : `userDashboard`);
        })
        .catch(() => {
          if (active) m(`로그인 상태를 확인하지 못했습니다. 잠시 후 다시 시도해 주세요.`);
        })
        .finally(() => {
          if (active) setAuthLoading(!1);
        });
      return () => { active = !1; };
    }, []),
    (0, r.useEffect)(() => {
      const refreshNotices = () => apiRequest(`/api/v1/notices`).then(setUserNotices).catch(() => setUserNotices([]));
      refreshNotices();
      window.addEventListener(`sparkplus-notices-updated`, refreshNotices);
      return () => {
        window.removeEventListener(`sparkplus-notices-updated`, refreshNotices);
      };
    }, []),
    (0, r.useEffect)(() => {
      const refreshAssignments = () => loadLearningCourses().catch(() => {});
      window.addEventListener(`sparkplus-course-assignments-updated`, refreshAssignments);
      window.addEventListener(`sparkplus-course-config-updated`, refreshAssignments);
      window.addEventListener(`sparkplus-course-progress`, refreshAssignments);
      window.addEventListener(`storage`, refreshAssignments);
      return () => {
        window.removeEventListener(`sparkplus-course-assignments-updated`, refreshAssignments);
        window.removeEventListener(`sparkplus-course-config-updated`, refreshAssignments);
        window.removeEventListener(`sparkplus-course-progress`, refreshAssignments);
        window.removeEventListener(`storage`, refreshAssignments);
      };
    }, []));
  let Z = h.find((e) => e.id === _) ?? h[0],
    Q = h.filter((e) => e.enrolled),
    activeUser = authenticatedUser
      ? {
          ...CURRENT_USER,
          id: authenticatedUser.employeeNumber || authenticatedUser.id,
          name: authenticatedUser.name,
          email: authenticatedUser.email,
          department: authenticatedUser.organizationName || `소속 미지정`,
          position: authenticatedUser.position || `직책 미지정`,
        }
      : CURRENT_USER,
    canUseAdminPortal = String(authenticatedUser?.role || ``).toUpperCase() === `ADMIN` || String(authenticatedUser?.email || ``).toLowerCase() === `jun.kang@sparkplus.co`,
    le = (0, r.useMemo)(
      () =>
        h.filter((e) => {
          let t = D.search.toLowerCase();
          return (
            (!t || `${e.title} ${e.description} ${(e.tags||[]).join(` `)}`.toLowerCase().includes(t)) &&
            (D.category === `전체 분야` || e.category === D.category) &&
            (D.level === `전체 레벨` || e.level === D.level) &&
            (D.recruit === `전체 상태` || userCourseStatus(e.status) === D.recruit)
          );
        }),
      [h, D],
    );
  async function $(e, n) {
    if ([`player`, `lectureDetail`].includes(e) && isManagedUserInactive(CURRENT_USER)) {
      alert(`비활성 계정은 신규 학습을 진행할 수 없습니다. 관리자에게 문의해주세요.`);
      return;
    }
    if ([`player`,`lectureDetail`].includes(e) && n) {
      try { const detail=await apiRequest(`/api/v1/learning/courses/${n}`); g((items)=>items.map((item)=>item.id===n?{...item,...detail,curriculum:detail.lessons}:item)); }
      catch { /* 기존 화면 데이터로 계속 진행 */ }
    }
    (e === `userRewards`
      ? setRewardInitialTab(n || `ranking`)
      : n && e === `noticeDetail`
        ? (await apiRequest(`/api/v1/notices/${n}/view`, { method: `POST` }).then(({ views }) => setUserNotices((items) => items.map((notice) => notice.id === n ? { ...notice, views } : notice))).catch(() => {}), Y(n))
        : n && v(n),
      t(e),
      z(!1),
      window.scrollTo({ top: 0, behavior: `smooth` }));
  }
  function ue() {
    window.location.assign(`/api/v1/auth/google`);
  }
  async function logout() {
    try {
      await fetch(`/api/v1/auth/logout`, { method: `POST`, credentials: `include` });
    } finally {
      setAuthenticatedUser(null);
      window.location.assign(`/`);
    }
  }
  async function de() {
    if (isManagedUserInactive(CURRENT_USER)) {
      alert(`비활성 계정은 신규 학습을 진행할 수 없습니다. 관리자에게 문의해주세요.`);
      return;
    }
    if (userCourseStatus(Z.status) !== `운영 중`) {
      I(userCourseStatus(Z.status) === `오픈 전` ? `아직 신청할 수 없는 과정입니다.` : `종료된 과정은 새로 신청할 수 없습니다.`);
      setTimeout(() => I(``), 2600);
      return;
    }
    try { const enrollment=await apiRequest(`/api/v1/learning/courses/${Z.id}/enroll`,{method:`POST`}); g((items)=>items.map((item)=>item.id===Z.id?{...item,enrolled:true,enrollmentId:enrollment.id,progress:0}:item)); M(`done`); }
    catch { I(`수강 신청을 처리하지 못했습니다.`); setTimeout(()=>I(``),2600); }
  }
  function toggleWishlist(courseId, next) {
    localStorage.setItem(`sparkplus-wishlist-${courseId}`, String(next));
    setWishlistIds((current) => next ? [...new Set([...current, courseId])] : current.filter((id) => id !== courseId));
  }
  function fe(complete = !1) {
    let e = complete ? 100 : Math.min(100, Math.max(Z.progress ?? 0, 72));
    (g((t) => t.map((t) => (t.id === Z.id ? { ...t, progress: e } : t))),
      q(72),
      I(`학습 진도가 저장되었습니다.`),
      setTimeout(() => I(``), 2600));
  }
  if (authLoading) return (0, i.jsx)(`main`, {
    className: `auth-loading`,
    children: (0, i.jsxs)(`div`, {
      children: [
        (0, i.jsxs)(`div`, { className: `auth-loading-logo`, children: [
          (0, i.jsx)(`b`, { children: `SPARKPLUS` }),
          (0, i.jsx)(`em`, { children: `LMS` }),
        ] }),
        (0, i.jsx)(`span`, { className: `auth-spinner`, "aria-hidden": `true` }),
        (0, i.jsx)(`p`, { children: `로그인 상태를 확인하고 있습니다.` }),
      ],
    }),
  });
  return e === `login`
    ? (0, i.jsx)(N, {
        error: p,
        onLogin: ue,
      })
    : n === `admin`
      ? (0, i.jsx)(f, {
          logout,
          user: authenticatedUser,
          switchToLearner: () => {
            a(`user`);
            t(`userDashboard`);
            z(!1);
          },
        })
      : (0, i.jsxs)(`div`, {
          className: `app-shell user-portal ${e === `userRewards` ? `reward-canvas-active` : ``}`,
          children: [
            (0, i.jsx)(F, {
              role: n,
              page: e,
              go: $,
              profileOpen: R,
              setProfileOpen: z,
              theme: theme,
              setTheme: setTheme,
              logout,
              user: activeUser,
              canAccessAdmin: canUseAdminPortal,
              onSwitchAdmin: () => {
                a(`admin`);
                t(`adminDashboard`);
                z(!1);
              },
            }),
            e === `userDashboard` && (0, i.jsx)(L, { courses: Q, go: $, notices: userNotices, user: activeUser }),
            e === `adminDashboard` && (0, i.jsx)(U, { go: $ }),
            e === `catalog` &&
              (0, i.jsx)(K, {
                courses: le,
                search: y,
                setSearch: b,
                category: x,
                setCategory: S,
                levelFilter: C,
                setLevelFilter: w,
                recruit: T,
                setRecruit: E,
                applyFilters: () =>
                  k({ search: y, category: x, level: C, recruit: T }),
                quickTag: (e) => {
                  (b(e),
                    S(`전체 분야`),
                    k({ search: e, category: `전체 분야`, level: C, recruit: T }));
                },
                reset: () => {
                  (b(``),
                    S(`전체 분야`),
                    w(`전체 레벨`),
                    E(`전체 상태`),
                    k({
                      search: ``,
                      category: `전체 분야`,
                      level: `전체 레벨`,
                      recruit: `전체 상태`,
                    }));
                },
                go: $,
                wishlistIds: wishlistIds,
                onWishlistChange: toggleWishlist,
              }),
            e === `courseDetail` &&
              (0, i.jsx)(X, {
                course: Z,
                go: $,
                apply: () => (Z.enrolled ? $(`lectureDetail`, Z.id) : M(`apply`)),
                wishlisted: wishlistIds.includes(Z.id),
                onWishlistChange: toggleWishlist,
              }),
            e === `learning` &&
              (0, i.jsx)(te, {
                courses: Q,
                allCourses: h,
                wishlistIds: wishlistIds,
                toggleWishlist: toggleWishlist,
                go: $,
                notify: (e) => {
                  (I(e), setTimeout(() => I(``), 2600));
                },
              }),
            e === `userRewards` && (0, i.jsx)(UserLearningRewards, { initialTab: rewardInitialTab }),
            e === `lectureDetail` && (0, i.jsx)(LectureDetailQuest, { course: Z, go: $, user:activeUser }),
            e === `courseSurvey` && (0, i.jsx)(GoogleFormSurveyPage, { course: Z, go: $ }),
            e === `player` &&
              (0, i.jsx)(re, {
                course: Z,
                go: $,
                lessonOpen: B,
                setLessonOpen: V,
                playing: H,
                setPlaying: W,
                videoProgress: G,
                saveProgress: fe,
              }),
            e === `noticeList` && (0, i.jsx)(ie, { go: $, notices: userNotices }),
            e === `noticeDetail` &&
              (0, i.jsx)(ae, {
                notice: userNotices.find((e) => e.id === J) ?? userNotices[0] ?? j[0],
                go: $,
                notices: userNotices,
              }),
            (e === `profile` || e === `password`) &&
              (0, i.jsx)(oe, {
                initialTab: e === `profile` ? `info` : `password`,
                notify: (e) => {
                  (I(e), setTimeout(() => I(``), 2600));
                },
              }),
            e === `placeholder` && (0, i.jsx)(se, { role: n, go: $ }),
            A &&
              (0, i.jsx)(ee, {
                kind: A,
                course: Z,
                close: () => M(null),
                enroll: de,
                goLearning: () => {
                  (M(null), $(`learning`));
                },
              }),
            P &&
              (0, i.jsxs)(`div`, {
                className: `toast`,
                children: [
                  (0, i.jsx)(`span`, {
                    children: (0, i.jsx)(Icon, { icon: CheckmarkCircle02Icon }),
                  }),
                  P,
                ],
              }),
            (0, i.jsx)(ce, {}),
          ],
        });
}
function N({ error, onLogin }) {
  return (0, i.jsxs)(`main`, {
    className: `login-page`,
    children: [
      (0, i.jsxs)(`section`, {
        className: `login-intro`,
        children: [
          (0, i.jsx)(`div`, {
            className: `intro-copy`,
            children: (0, i.jsx)(`div`, {
              className: `login-hero-logo`,
              children: (0, i.jsx)(P, {}),
            }),
          }),
          (0, i.jsxs)(`div`, {
            className: `intro-art`,
            children: [
              (0, i.jsx)(`span`, {}),
              (0, i.jsx)(`span`, {}),
              (0, i.jsx)(`span`, {}),
            ],
          }),
        ],
      }),
      (0, i.jsx)(`section`, {
        className: `login-panel`,
        children: (0, i.jsxs)(`div`, {
          className: `login-card`,
          children: [
            (0, i.jsx)(`div`, {
              className: `mobile-logo`,
              children: (0, i.jsx)(P, {}),
            }),
            (0, i.jsxs)(`div`, {
              className: `login-title`,
              children: [
                (0, i.jsx)(P, {}),
              ],
            }),
            (0, i.jsx)(`p`, { className: `login-description`, children: `회사 Google 계정으로 안전하게 로그인하세요.` }),
            error && (0, i.jsx)(`div`, { className: `form-error`, children: error }),
            (0, i.jsx)(`button`, {
              className: `primary large google-login-button`,
              type: `button`,
              onClick: onLogin,
              children: [
                (0, i.jsx)(`span`, { className: `google-mark`, children: `G` }),
                (0, i.jsx)(`span`, { children: `회사 Google 계정으로 로그인` }),
              ],
            }),
            (0, i.jsx)(`p`, { className: `login-domain-note`, children: `@sparkplus.co 계정만 이용할 수 있습니다.` }),
          ],
        }),
      }),
    ],
  });
}
function P({ light: e = !1 }) {
  return (0, i.jsxs)(`div`, {
    className: `logo ${e ? `logo-light` : ``}`,
    children: [
      (0, i.jsx)(`img`, {
        src: `https://sparkplus-lms-prototype.min20993.chatgpt.site/sparkplus-logo-black.png`,
        alt: `SPARKPLUS`,
      }),
      (0, i.jsx)(`em`, { children: `LMS` }),
    ],
  });
}
function F({
  role: e,
  page: t,
  go: n,
  profileOpen: r,
  setProfileOpen: a,
  logout: o,
  theme: s,
  setTheme: c,
  user,
  canAccessAdmin,
  onSwitchAdmin,
}) {
  return (0, i.jsx)(`header`, {
    className: `topbar`,
    children: (0, i.jsxs)(`div`, {
      className: `topbar-inner`,
      children: [
        (0, i.jsx)(`button`, {
          className: `brand-button`,
          onClick: () => n(e === `user` ? `userDashboard` : `adminDashboard`),
          children: (0, i.jsx)(P, {}),
        }),
        (0, i.jsx)(`nav`, {
          children: A[e].map(([e, r]) =>
            (0, i.jsx)(
              `button`,
              {
                className:
                  t === e ||
                  (e === `learning` &&
                    [`lectureDetail`, `player`].includes(t)) ||
                  (e === `noticeList` && t === `noticeDetail`)
                    ? `active`
                    : ``,
                onClick: () => n(e),
                children: [
                  (0, i.jsx)(Icon, { icon: menuIcon(r) }),
                  (0, i.jsx)(`span`, { children: r }),
                ],
              },
              r,
            ),
          ),
        }),
        (0, i.jsxs)(`div`, {
          className: `header-tools`,
          children: [
            canAccessAdmin && (0, i.jsxs)(`button`, {
              className: `portal-switch-button`,
              type: `button`,
              onClick: onSwitchAdmin,
              title: `관리자 화면으로 전환`,
              children: [
                (0, i.jsx)(Icon, { icon: Settings02Icon, size: 18 }),
                (0, i.jsx)(`span`, { children: `관리자 화면` }),
              ],
            }),
            (0, i.jsx)(`button`, {
              className: `theme-toggle`,
              onClick: () => c(s === `light` ? `dark` : `light`),
              title: `라이트·다크 모드 전환`,
              children: (0, i.jsx)(Icon, {
                icon: s === `light` ? Moon02Icon : Sun03Icon,
                size: 20,
              }),
            }),
            (0, i.jsxs)(`button`, {
              className: `profile`,
              onClick: () => a(!r),
              children: [
                (0, i.jsx)(`span`, {
                  className: `avatar`,
                  children: e === `user` ? user.name[0] : `관`,
                }),
                (0, i.jsxs)(`span`, {
                  className: `profile-copy`,
                  children: [
                    (0, i.jsx)(`b`, {
                      children: e === `user` ? user.name : `관리자`,
                    }),
                    (0, i.jsx)(`small`, {
                      children: e === `user` ? user.department : `인재개발팀`,
                    }),
                  ],
                }),
                (0, i.jsx)(`span`, { children: `⌄` }),
              ],
            }),
            r &&
              (0, i.jsxs)(`div`, {
                className: `profile-menu`,
                children: [
                  (0, i.jsxs)(`div`, {
                    className: `profile-menu-head`,
                    children: [
                      (0, i.jsx)(`b`, {
                        children: e === `user` ? user.name : `LMS 관리자`,
                      }),
                      (0, i.jsx)(`small`, {
                        children:
                          e === `user`
                            ? user.email
                            : user?.email || `LMS 관리자`,
                      }),
                    ],
                  }),
                  e === `user` &&
                    (0, i.jsxs)(i.Fragment, {
                      children: [
                        canAccessAdmin && (0, i.jsxs)(`button`, {
                          className: `profile-admin-switch`,
                          onClick: onSwitchAdmin,
                          children: [
                            (0, i.jsx)(`span`, { children: `관리자 화면으로 전환` }),
                            (0, i.jsx)(`em`, { children: `›` }),
                          ],
                        }),
                        (0, i.jsxs)(`button`, {
                          onClick: () => n(`profile`),
                          children: [
                            (0, i.jsx)(`span`, { children: `회원정보 수정` }),
                            (0, i.jsx)(`em`, { children: `›` }),
                          ],
                        }),
                        (0, i.jsxs)(`button`, {
                          onClick: () => n(`learning`),
                          children: [
                            (0, i.jsx)(`span`, { children: `수강 이력` }),
                            (0, i.jsx)(`em`, { children: `›` }),
                          ],
                        }),
                      ],
                    }),
                  (0, i.jsxs)(`button`, {
                    className: `logout-button`,
                    onClick: o,
                    children: [
                      (0, i.jsx)(Icon, { icon: Logout01Icon }),
                      (0, i.jsx)(`span`, { children: `로그아웃` }),
                    ],
                  }),
                ],
              }),
          ],
        }),
      ],
    }),
  });
}
function PageHeader({ kicker: e, title: t, description: n, action: r, hero = false, heroVariant = `default` }) {
  return (0, i.jsxs)(`div`, {
    className: `page-head ${hero ? `page-hero page-hero-${heroVariant}` : ``}`,
    children: [
      (0, i.jsxs)(`div`, {
        children: [
          e &&
            (0, i.jsxs)(`div`, {
              className: `breadcrumb`,
              children: [`홈 `, (0, i.jsx)(`span`, { children: `›` }), ` `, e],
            }),
          (0, i.jsx)(`h1`, { children: t }),
          n && (0, i.jsx)(`p`, { children: n }),
        ],
      }),
      r,
    ],
  });
}
function L({ courses: e, go: t, notices = [], user = CURRENT_USER }) {
  const n = e.find((course) => !isCourseCompleted(course)) ?? e[0] ?? null;
  const [homeData,setHomeData]=r.useState({stats:{inProgress:0,completed:0,rank:null},ranking:[],popular:[],badges:[]});
  const [homeLoading,setHomeLoading]=r.useState(true);
  r.useEffect(()=>{let active=true;apiRequest(`/api/v1/learning/home`).then((data)=>active&&setHomeData(data)).catch(()=>{}).finally(()=>active&&setHomeLoading(false));return()=>{active=false;};},[]);
  const ranking=homeData.ranking||[],popular=homeData.popular||[],badges=homeData.badges||[];
  const todayLabel=new Intl.DateTimeFormat(`ko-KR`,{month:`long`,day:`numeric`,weekday:`long`}).format(new Date());
  return (
    <main className="page dashboard-page home-minimal">
      <section className="home-welcome">
        <div className="home-greeting-group">
          <div className="home-welcome-sticker" aria-hidden="true">
            <HomeGreetingSticker />
          </div>
          <div className="home-welcome-copy">
            <span>{todayLabel}</span>
            <h1>
              <span>{user.name}님,</span>
              <span>오늘도 가볍게 시작해볼까요?</span>
            </h1>
          </div>
        </div>
        <div className="home-quick-stats">
          <div>
            <span>수강 중</span>
            <b>{homeData.stats?.inProgress ?? 0}</b>
          </div>
          <div>
            <span>수료</span>
            <b>{homeData.stats?.completed ?? 0}</b>
          </div>
          <div>
            <span>현재 순위</span>
            <b>{homeData.stats?.rank ? `${homeData.stats.rank}위` : `-`}</b>
          </div>
        </div>
      </section>

      <section className="home-primary-grid">
        <article className="home-continue">
          <div className="home-section-label">
            <span>
              <Icon icon={PlayIcon} size={16} />
            </span>
            이어서 학습하기
          </div>
          {n ? <div className="home-continue-content">
            <J accent={n.accent} label={n.category} />
            <div>
              <small>
                {n.category} · {n.level}
              </small>
              <h2>{n.title}</h2>
              {n.requiredTraining && <div className="course-title-status-line"><RequiredTrainingBadge deadline={n.assignmentDeadline} compact completed={isCourseCompleted(n)} /></div>}
              <div className="home-progress-line">
                <Z value={n.progress ?? 0} />
                <span>{n.progress ?? 0}%</span>
              </div>
              <button className="primary" onClick={() => t(`player`, n.id)}>
                학습 이어가기 <Icon icon={ArrowRight01Icon} />
              </button>
            </div>
          </div> : <div className="home-data-empty">현재 수강 중인 교육과정이 없습니다.</div>}
        </article>

        <article className="home-ranking">
          <div className="home-reward-confetti" aria-hidden="true"><i /><i /><i /><i /><i /><i /></div>
          <div className="home-card-head">
            <div>
              <span className="home-reward-title-icon">
                <RewardObject type="trophy" tone="gold" />
              </span>
              <div>
                <h2>이달의 학습</h2>
                <small>{new Date().getMonth()+1}월 Learning League TOP 3</small>
              </div>
            </div>
            <button className="home-reward-cta" onClick={() => t(`userRewards`, `ranking`)}>전체 보기 <Icon icon={ArrowRight01Icon} size={14} /></button>
          </div>
          <div className="home-mini-podium">
            {[ranking[1], ranking[0], ranking[2]].filter(Boolean).map((person) => (
              <div className={`home-podium-player rank-${person.rank}`} key={person.rank}>
                <div className="home-podium-avatar"><RewardAvatar tone={person.rank === 1 ? `coral` : person.rank === 2 ? `indigo` : `mint`} crown={person.rank === 1} /><span>{person.rank}</span></div>
                <b>{person.name}</b>
                <small>{person.dept}</small>
                <strong>{person.score.toLocaleString()}P</strong>
                <i><span>{person.rank}</span></i>
              </div>
            ))}
          </div>
          {!homeLoading && ranking.length===0 && <div className="home-data-empty">이번 달 학습 포인트 기록이 없습니다.</div>}
        </article>
      </section>

      <section className="home-popular-section">
        <div className="home-section-head">
          <div>
            <span className="home-icon blue">
              <Icon icon={ThumbsUpIcon} />
            </span>
            <div>
              <h2>이번 달 인기 교육</h2>
              <p>구성원들이 가장 유익하게 본 과정이에요</p>
            </div>
          </div>
          <button onClick={() => t(`catalog`)}>
            전체 보기 <Icon icon={ArrowRight01Icon} size={16} />
          </button>
        </div>
        <div className="home-popular-list">
          {popular.map((course, index) => (
            <button
              key={course.id}
              onClick={() => t(`courseDetail`, course.id)}
            >
              <span className="home-popular-rank">0{index + 1}</span>
              <J accent={course.accent} compact={true} />
              <div>
                <small>{course.category}</small>
                <b>{course.title}</b>
                <em>
                  <Icon icon={BookOpen01Icon} size={14} />
                  수강 {course.learners}명
                </em>
              </div>
              <Icon icon={ArrowRight01Icon} className="home-course-arrow" />
            </button>
          ))}
        </div>
        {!homeLoading && popular.length===0 && <div className="home-data-empty">현재 운영 중인 교육과정이 없습니다.</div>}
      </section>

      <section className="home-bottom-grid">
        <article className="home-notices">
          <div className="home-section-head">
            <div>
              <span className="home-icon mint">
                <Icon icon={Notification01Icon} />
              </span>
              <div>
                <h2>최근 공지사항</h2>
              </div>
            </div>
            <button onClick={() => t(`noticeList`)}>
              전체 보기 <Icon icon={ArrowRight01Icon} size={16} />
            </button>
          </div>
          <div className="home-notice-list">
            {notices.slice(0, 3).map((notice) => (
              <button
                onClick={() => t(`noticeDetail`, notice.id)}
                key={notice.id}
              >
                <span>
                  {notice.important && <i>중요</i>}
                  {notice.title}
                </span>
                <small>{notice.date.slice(5)}</small>
              </button>
            ))}
          </div>
          {notices.length===0 && <div className="home-data-empty">등록된 공지사항이 없습니다.</div>}
        </article>
        <article className="home-badge">
          <div className="home-reward-confetti badge-confetti" aria-hidden="true"><i /><i /><i /><i /></div>
          <div className="home-card-head">
            <div>
              <span className="home-reward-title-icon badge-title-icon">
                <RewardObject type="medal" tone="violet" />
              </span>
              <div>
                <h2>나의 학습 뱃지</h2>
                <small>획득한 보상을 모아보세요</small>
              </div>
            </div>
            <button className="home-view-all" onClick={() => t(`userRewards`, `badges`)}>
              전체보기 <Icon icon={ArrowRight01Icon} size={15} />
            </button>
          </div>
          <div className="home-badge-preview">{badges.map((badge)=><div className={badge.tone||`blue`} key={badge.name}><span><RewardObject type={badge.icon||`medal`} tone={badge.tone||`blue`} /></span><b>{badge.name}</b><small>획득 완료</small></div>)}</div>
          {!homeLoading && badges.length===0 && <div className="home-data-empty">아직 획득한 뱃지가 없습니다.</div>}
        </article>
      </section>
    </main>
  );
}
function R({ label: e, value: t, tone: n }) {
  return (0, i.jsxs)(`div`, {
    className: `user-status ${n}`,
    children: [
      (0, i.jsx)(`span`, { children: e }),
      (0, i.jsxs)(`p`, {
        children: [
          (0, i.jsx)(`strong`, { children: t }),
          (0, i.jsx)(`em`, { children: `개 과정` }),
        ],
      }),
    ],
  });
}
function z({ label: e, value: t, tone: n, note: r }) {
  return (0, i.jsxs)(`article`, {
    className: `summary ${n}`,
    children: [
      (0, i.jsxs)(`div`, {
        children: [
          (0, i.jsx)(`span`, { children: e }),
          (0, i.jsxs)(`strong`, {
            children: [t, (0, i.jsx)(`em`, { children: `개` })],
          }),
        ],
      }),
      (0, i.jsx)(`span`, {
        className: `summary-icon`,
        children:
          n === `blue` ? `▶` : n === `green` ? `✓` : n === `red` ? `!` : `◷`,
      }),
      (0, i.jsx)(`small`, { children: r }),
    ],
  });
}
function B({ title: e, action: t }) {
  return (0, i.jsxs)(`div`, {
    className: `section-title`,
    children: [(0, i.jsx)(`h2`, { children: e }), t],
  });
}
function V({ d: e, title: t, date: n, urgent: r = !1 }) {
  return (0, i.jsxs)(`div`, {
    className: `deadline ${r ? `urgent` : ``}`,
    children: [
      (0, i.jsx)(`span`, { children: e }),
      (0, i.jsxs)(`div`, {
        children: [
          (0, i.jsx)(`b`, { children: t }),
          (0, i.jsx)(`small`, { children: n }),
        ],
      }),
    ],
  });
}
function H({ title: e, date: t, important: n = !1, onClick: r }) {
  return (0, i.jsxs)(`button`, {
    className: `notice-row`,
    onClick: r,
    children: [
      (0, i.jsxs)(`span`, {
        children: [n && (0, i.jsx)(`i`, { children: `중요` }), e],
      }),
      (0, i.jsx)(`small`, { children: t }),
    ],
  });
}
function U({ go: e }) {
  return (0, i.jsxs)(`main`, {
    className: `page dashboard-page`,
    children: [
      (0, i.jsx)(PageHeader, {
        title: `관리자 대시보드`,
        description: `교육 운영 현황을 한눈에 확인하고 빠르게 관리하세요.`,
        action: (0, i.jsx)(`span`, {
          className: `last-login`,
          children: `2026년 8월 5일 수요일`,
        }),
      }),
      (0, i.jsxs)(`div`, {
        className: `summary-grid`,
        children: [
          (0, i.jsx)(z, {
            label: `운영 중인 과정`,
            value: `18`,
            tone: `blue`,
            note: `전월 대비 +2`,
          }),
          (0, i.jsx)(z, {
            label: `전체 학습자`,
            value: `248`,
            tone: `violet`,
            note: `활성 계정`,
          }),
          (0, i.jsx)(z, {
            label: `이번 달 수료 인원`,
            value: `64`,
            tone: `green`,
            note: `전월 대비 +12`,
          }),
          (0, i.jsx)(z, {
            label: `평균 수료율`,
            value: `84`,
            tone: `red`,
            note: `목표 80% 이상`,
          }),
        ],
      }),
      (0, i.jsxs)(`section`, {
        className: `quick-actions`,
        children: [
          (0, i.jsx)(`span`, { children: `빠른 실행` }),
          (0, i.jsx)(`button`, {
            className: `primary`,
            onClick: () => e(`placeholder`),
            children: [(0, i.jsx)(Icon, { icon: Add01Icon }), `새 과정 등록`],
          }),
          (0, i.jsx)(`button`, {
            onClick: () => e(`placeholder`),
            children: [(0, i.jsx)(Icon, { icon: Search01Icon }), `학습자 조회`],
          }),
          (0, i.jsx)(`button`, {
            onClick: () => e(`placeholder`),
            children: [(0, i.jsx)(Icon, { icon: Edit02Icon }), `새 공지 작성`],
          }),
          (0, i.jsx)(`button`, {
            onClick: () => e(`placeholder`),
            children: [
              (0, i.jsx)(Icon, { icon: ChartHistogramIcon }),
              `통계 조회`,
            ],
          }),
        ],
      }),
      (0, i.jsxs)(`div`, {
        className: `admin-grid`,
        children: [
          (0, i.jsxs)(`section`, {
            className: `card span-2`,
            children: [
              (0, i.jsx)(B, {
                title: `최근 등록된 과정`,
                action: (0, i.jsx)(`button`, {
                  onClick: () => e(`placeholder`),
                  children: `전체 보기`,
                }),
              }),
              (0, i.jsxs)(`table`, {
                children: [
                  (0, i.jsx)(`thead`, {
                    children: (0, i.jsxs)(`tr`, {
                      children: [
                        (0, i.jsx)(`th`, { children: `과정명` }),
                        (0, i.jsx)(`th`, { children: `교육 분야` }),
                        (0, i.jsx)(`th`, { children: `수강 인원` }),
                        (0, i.jsx)(`th`, { children: `상태` }),
                      ],
                    }),
                  }),
                  (0, i.jsxs)(`tbody`, {
                    children: [
                      (0, i.jsxs)(`tr`, {
                        children: [
                          (0, i.jsx)(`td`, {
                            children: (0, i.jsx)(`b`, {
                              children: `생성형 AI 실무 활용법`,
                            }),
                          }),
                          (0, i.jsx)(`td`, { children: `AI·DX` }),
                          (0, i.jsx)(`td`, { children: `42명` }),
                          (0, i.jsx)(`td`, {
                            children: (0, i.jsx)(`span`, {
                              className: `badge blue-badge`,
                              children: `운영 중`,
                            }),
                          }),
                        ],
                      }),
                      (0, i.jsxs)(`tr`, {
                        children: [
                          (0, i.jsx)(`td`, {
                            children: (0, i.jsx)(`b`, {
                              children: `신임 리더 온보딩`,
                            }),
                          }),
                          (0, i.jsx)(`td`, { children: `리더십` }),
                          (0, i.jsx)(`td`, { children: `24명` }),
                          (0, i.jsx)(`td`, {
                            children: (0, i.jsx)(`span`, {
                              className: `badge green-badge`,
                              children: `운영 중`,
                            }),
                          }),
                        ],
                      }),
                      (0, i.jsxs)(`tr`, {
                        children: [
                          (0, i.jsx)(`td`, {
                            children: (0, i.jsx)(`b`, {
                              children: `개인정보보호 필수 교육`,
                            }),
                          }),
                          (0, i.jsx)(`td`, { children: `법정의무` }),
                          (0, i.jsx)(`td`, { children: `210명` }),
                          (0, i.jsx)(`td`, {
                            children: (0, i.jsx)(`span`, {
                              className: `badge gray-badge`,
                              children: `운영 중`,
                            }),
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
          (0, i.jsxs)(`section`, {
            className: `card chart-card`,
            children: [
              (0, i.jsx)(B, { title: `과정별 평균 진도율` }),
              (0, i.jsxs)(`div`, {
                className: `bar-chart`,
                children: [
                  (0, i.jsx)(W, { label: `AI 실무`, value: 78 }),
                  (0, i.jsx)(W, { label: `리더십`, value: 64 }),
                  (0, i.jsx)(W, { label: `개인정보`, value: 91 }),
                  (0, i.jsx)(W, { label: `커뮤니케이션`, value: 56 }),
                ],
              }),
            ],
          }),
          (0, i.jsxs)(`section`, {
            className: `card span-2`,
            children: [
              (0, i.jsx)(B, { title: `최근 학습 현황` }),
              (0, i.jsxs)(`div`, {
                className: `activity-list`,
                children: [
                  (0, i.jsx)(G, {
                    name: `김지수`,
                    text: `데이터 분석 기초 3차시를 완료했습니다.`,
                    time: `10분 전`,
                  }),
                  (0, i.jsx)(G, {
                    name: `이민호`,
                    text: `개인정보보호 필수 교육을 수료했습니다.`,
                    time: `32분 전`,
                  }),
                  (0, i.jsx)(G, {
                    name: `박서연`,
                    text: `신임 리더 온보딩에 수강 신청했습니다.`,
                    time: `1시간 전`,
                  }),
                ],
              }),
            ],
          }),
          (0, i.jsxs)(`section`, {
            className: `card notices`,
            children: [
              (0, i.jsx)(B, {
                title: `최근 공지사항`,
                action: (0, i.jsx)(`button`, {
                  onClick: () => e(`placeholder`),
                  children: `관리`,
                }),
              }),
              (0, i.jsx)(H, {
                title: `하반기 법정의무교육 안내`,
                date: `08.04`,
                important: !0,
              }),
              (0, i.jsx)(H, { title: `시스템 정기 점검 안내`, date: `08.01` }),
              (0, i.jsx)(H, { title: `8월 신규 과정 오픈`, date: `07.29` }),
            ],
          }),
        ],
      }),
    ],
  });
}
function W({ label: e, value: t }) {
  return (0, i.jsxs)(`div`, {
    className: `bar-row`,
    children: [
      (0, i.jsx)(`span`, { children: e }),
      (0, i.jsx)(`div`, {
        children: (0, i.jsx)(`i`, { style: { width: `${t}%` } }),
      }),
      (0, i.jsxs)(`b`, { children: [t, `%`] }),
    ],
  });
}
function G({ name: e, text: t, time: n }) {
  return (0, i.jsxs)(`div`, {
    className: `activity`,
    children: [
      (0, i.jsx)(`span`, { className: `avatar small`, children: e[0] }),
      (0, i.jsxs)(`div`, {
        children: [
          (0, i.jsx)(`b`, { children: e }),
          (0, i.jsx)(`p`, { children: t }),
        ],
      }),
      (0, i.jsx)(`small`, { children: n }),
    ],
  });
}
function K({
  courses: e,
  search: t,
  setSearch: n,
  category: categoryFilter,
  setCategory: a,
  levelFilter: o,
  setLevelFilter: s,
  recruit: c,
  setRecruit: l,
  applyFilters: u,
  quickTag: p,
  reset: d,
  go: f,
  wishlistIds = [],
  onWishlistChange,
}) {
  const [tags,setTags]=r.useState([]);
  r.useEffect(()=>{let active=true;apiRequest(`/api/v1/learning/featured-tags`).then((items)=>active&&setTags(items)).catch(()=>{});return()=>{active=false;};},[]);
  const useTag = (tag) => p(tag);
  return (
    <main className="page toss-page">
      <PageHeader
        kicker="교육과정 조회"
        title="교육과정 조회"
        description="성장을 위한 다양한 교육과정을 찾아보세요."
        hero
        heroVariant="catalog"
      />
      <SearchFilterPanel
        value={t}
        onValueChange={n}
        placeholder="과정명, 키워드 검색"
        filters={[
          { label: `분야`, value: categoryFilter, onChange: a, options: [`전체 분야`, `직무역량`, `리더십`, `개발`, `커뮤니케이션`, `법정의무`, `AI·DX`] },
          { label: `레벨`, value: o, onChange: s, options: [`전체 레벨`, `레벨 1`, `레벨 2`, `레벨 3`] },
          { label: `과정 상태`, value: c, onChange: l, options: [`전체 상태`, `오픈 전`, `운영 중`, `종료`] },
        ]}
        onSearch={u}
        onReset={d}
        quickTags={tags}
        onQuickTag={useTag}
      />
      <div className="result-head">
        <p>
          총 <b>{e.length}</b>개 과정
        </p>
        <select aria-label="정렬">
          <option>추천순</option>
          <option>인기순</option>
          <option>최신순</option>
          <option>종료 임박순</option>
        </select>
      </div>
      {e.length ? (
        <div className="course-grid">
          {e.map((course) => (
            <Y course={course} go={f} key={course.id} wishlisted={wishlistIds.includes(course.id)} onWishlistChange={onWishlistChange} />
          ))}
        </div>
      ) : (
        <div className="empty">
          <h3>조건에 맞는 과정이 없습니다</h3>
        </div>
      )}
      <div className="pagination">
        <button disabled>‹</button>
        <button className="selected">1</button>
        <button>2</button>
        <button>›</button>
      </div>
    </main>
  );
}
function q({ value: e, set: t, options: n }) {
  return (0, i.jsx)(`select`, {
    value: e,
    onChange: (e) => t(e.target.value),
    children: n.map((e) => (0, i.jsx)(`option`, { children: e }, e)),
  });
}
function J({ accent: e, label: t, compact: n = !1 }) {
  return (0, i.jsxs)(`div`, {
    className: `course-visual ${e} ${n ? `compact` : ``}`,
    children: [
      (0, i.jsx)(`div`, { className: `visual-grid` }),
      (0, i.jsx)(`span`, { className: `visual-orb` }),
      t && (0, i.jsx)(`b`, { children: t }),
      (0, i.jsx)(`i`, {}),
      (0, i.jsx)(`i`, {}),
      (0, i.jsx)(`i`, {}),
    ],
  });
}
function Y({ course: e, go: t, wishlisted: controlledWishlisted, onWishlistChange }) {
  const base = [74, 87, 98, 64, 53, 126][e.id - 1] || 42;
  const recommendKey = `sparkplus-recommend-${e.id}`;
  const wishlistKey = `sparkplus-wishlist-${e.id}`;
  const [recommended, setRecommended] = (0, r.useState)(
    () => localStorage.getItem(recommendKey) === `true`,
  );
  const [localWishlisted, setLocalWishlisted] = (0, r.useState)(
    () => localStorage.getItem(wishlistKey) === `true`,
  );
  const wishlisted = controlledWishlisted ?? localWishlisted;
  const cta = courseCtaState(e);
  const toggleRecommend = () => {
    const next = !recommended;
    setRecommended(next);
    localStorage.setItem(recommendKey, String(next));
  };
  const toggleWishlist = () => {
    const next = !wishlisted;
    if (onWishlistChange) onWishlistChange(e.id, next);
    else {
      setLocalWishlisted(next);
      localStorage.setItem(wishlistKey, String(next));
    }
  };
  return (
    <article className="course-card toss-card">
      <div className="visual-wrap">
        <J accent={e.accent} label={e.category} />
        <CourseStatusBadge status={e.status} className="status-ribbon" />
        <button
          type="button"
          className={`course-wishlist ${wishlisted ? `wishlisted` : ``}`}
          onClick={toggleWishlist}
          aria-label={wishlisted ? `찜 해제` : `강의 찜하기`}
          title={wishlisted ? `찜 해제` : `강의 찜하기`}
        >
          <WishlistHeart filled={wishlisted} size={27} />
        </button>
      </div>
      <div className="course-card-body">
        <div className="course-labels">
          <span className="category-text">{e.category}</span>
          <span className={`level-badge ${userLevelTone(e.level)}`}>{userLevelLabel(e.level)}</span>
        </div>
        <h2>{e.title}</h2>
        {e.requiredTraining && <div className="course-title-status-line"><RequiredTrainingBadge deadline={e.assignmentDeadline} compact completed={isCourseCompleted(e)} /></div>}
        <div className="card-meta">
          <span>▣ {e.duration}</span>
          <span>수강 {48 + e.id * 11}명</span>
        </div>
        <button
          type="button"
          className={`course-recommend ${recommended ? `recommended` : ``}`}
          onClick={toggleRecommend}
          title="이 강의를 추천해요"
        >
          <Icon icon={ThumbsUpIcon} size={15} />
          <span>추천 {base + (recommended ? 1 : 0)}</span>
        </button>
        <div className="card-actions single-action">
          <button
            className={`course-action ${cta.action === `enter` || cta.action === `certificate` ? `enter-course` : `enroll-course`}`}
            disabled={cta.disabled}
            onClick={() => !cta.disabled && t(cta.action === `enroll` ? `courseDetail` : `lectureDetail`, e.id)}
          >
            {cta.label}
          </button>
        </div>
      </div>
    </article>
  );
}
function X({ course: e, go: t, apply: n, preview = false, wishlisted: controlledWishlisted, onWishlistChange }) {
  let a = e.curriculum || k[e.id] || [],
    [o, s] = (0, r.useState)(`intro`),
    recommendKey = `sparkplus-recommend-${e.id}`,
    wishlistKey = `sparkplus-wishlist-${e.id}`,
    [recommended, setRecommended] = (0, r.useState)(() => localStorage.getItem(recommendKey) === `true`),
    [localWishlisted, setLocalWishlisted] = (0, r.useState)(() => localStorage.getItem(wishlistKey) === `true`),
    baseLikes = [74, 87, 98, 64, 53, 126][e.id - 1] || 42;
  const wishlisted = controlledWishlisted ?? localWishlisted;
  const cta = courseCtaState(e);
  const toggleRecommend = () => {
    const next = !recommended;
    setRecommended(next);
    localStorage.setItem(recommendKey, String(next));
  };
  const toggleWishlist = () => {
    const next = !wishlisted;
    if (onWishlistChange) onWishlistChange(e.id, next);
    else {
      setLocalWishlisted(next);
      localStorage.setItem(wishlistKey, String(next));
    }
  };
  return (0, i.jsxs)(`main`, {
    className: `page`,
    children: [
      (0, i.jsxs)(`div`, {
        className: `breadcrumb`,
        children: [
          (0, i.jsx)(`button`, {
            onClick: () => t(`catalog`),
            children: `교육과정`,
          }),
          (0, i.jsx)(`span`, { children: `›` }),
          e.category,
          (0, i.jsx)(`span`, { children: `›` }),
          `과정 상세`,
        ],
      }),
      (0, i.jsxs)(`div`, {
        className: `detail-hero`,
        children: [
          e.thumbnail
            ? (0, i.jsx)(`img`, { className: `detail-course-thumbnail`, src: e.thumbnail, alt: `${e.title} 썸네일` })
            : (0, i.jsx)(J, { accent: e.accent, label: e.category }),
          (0, i.jsxs)(`div`, {
            className: `detail-intro`,
            children: [
              (0, i.jsxs)(`div`, {
                className: `detail-course-labels`,
                children: [
                  (0, i.jsxs)(`div`, { children: [
                    (0, i.jsx)(`span`, {
                      className: `badge blue-badge`,
                      children: e.category,
                    }),
                    (0, i.jsx)(CourseStatusBadge, { status: e.status }),
                  ] }),
                  (0, i.jsxs)(`div`, { className: `detail-course-actions`, children: [
                    (0, i.jsxs)(`button`, {
                      type: `button`,
                      className: `course-recommend ${recommended ? `recommended` : ``}`,
                      onClick: toggleRecommend,
                      title: `이 강의를 추천해요`,
                      children: [(0, i.jsx)(Icon, { icon: ThumbsUpIcon, size: 16 }), (0, i.jsx)(`span`, { children: `추천 ${baseLikes + (recommended ? 1 : 0)}` })],
                    }),
                    (0, i.jsx)(`button`, {
                      type: `button`,
                      className: `course-wishlist detail-wishlist ${wishlisted ? `wishlisted` : ``}`,
                      onClick: toggleWishlist,
                      title: wishlisted ? `찜 해제` : `강의 찜하기`,
                      "aria-label": wishlisted ? `찜 해제` : `강의 찜하기`,
                      children: (0, i.jsx)(WishlistHeart, { filled: wishlisted, size: 28 }),
                    }),
                  ] }),
                ],
              }),
              (0, i.jsx)(`h1`, { children: e.title }),
              e.requiredTraining && (0, i.jsx)(`div`, { className: `course-title-status-line detail-required-line`, children: (0, i.jsx)(RequiredTrainingBadge, { deadline: e.assignmentDeadline, compact: true, completed: isCourseCompleted(e) }) }),
              (0, i.jsx)(`p`, { children: e.description }),
              (0, i.jsxs)(`div`, {
                className: `detail-meta`,
                children: [
                  (0, i.jsxs)(`span`, {
                    children: [
                      (0, i.jsx)(`small`, { children: `난이도` }),
                      (0, i.jsx)(`b`, { className: `level-badge ${userLevelTone(e.level)}`, children: userLevelLabel(e.level) }),
                    ],
                  }),
                  (0, i.jsxs)(`span`, {
                    children: [
                      (0, i.jsx)(`small`, { children: `학습 시간` }),
                      (0, i.jsx)(`b`, { children: e.duration }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
      (0, i.jsxs)(`div`, {
        className: `detail-layout`,
        children: [
          (0, i.jsxs)(`article`, {
            className: `detail-content`,
            children: [
              (0, i.jsxs)(`div`, {
                className: `tabs`,
                role: `tablist`,
                children: [
                  (0, i.jsx)(`button`, {
                    role: `tab`,
                    "aria-selected": o === `intro`,
                    className: o === `intro` ? `active` : ``,
                    onClick: () => s(`intro`),
                    children: `과정 소개`,
                  }),
                  (0, i.jsx)(`button`, {
                    role: `tab`,
                    "aria-selected": o === `curriculum`,
                    className: o === `curriculum` ? `active` : ``,
                    onClick: () => s(`curriculum`),
                    children: `커리큘럼`,
                  }),
                ],
              }),
              o === `intro`
                ? (0, i.jsxs)(`div`, {
                    className: `tab-panel`,
                    role: `tabpanel`,
                    children: [
                      (0, i.jsxs)(`section`, {
                        children: [
                          (0, i.jsx)(`h2`, { children: `과정 소개` }),
                          (0, i.jsxs)(`p`, {
                            children: [
                              e.introduction || e.description,
                              !preview && ` 실무에서 바로 활용할 수 있도록 핵심 개념과 사례를 중심으로 구성했습니다.`,
                            ],
                          }),
                        ],
                      }),
                      (0, i.jsxs)(`section`, {
                        children: [
                          (0, i.jsx)(`h2`, { children: `학습 목표` }),
                          (0, i.jsxs)(`ul`, {
                            className: `check-list`,
                            children: [
                              (0, i.jsx)(`li`, {
                                children: `과정의 핵심 개념과 업무 적용 방법을 이해할 수 있습니다.`,
                              }),
                              (0, i.jsx)(`li`, {
                                children: `주요 사례를 통해 실제 상황에 필요한 판단 기준을 익힐 수 있습니다.`,
                              }),
                              (0, i.jsx)(`li`, {
                                children: `학습한 내용을 자신의 업무에 적용할 수 있습니다.`,
                              }),
                            ],
                          }),
                        ],
                      }),
                    ],
                  })
                : (0, i.jsx)(`div`, {
                    className: `tab-panel curriculum-panel`,
                    role: `tabpanel`,
                    children: (0, i.jsxs)(`section`, {
                      children: [
                        (0, i.jsx)(`h2`, { children: `전체 커리큘럼` }),
                        (0, i.jsxs)(`p`, {
                          className: `curriculum-guide`,
                          children: [
                            e.curriculumSummary && `${e.curriculumSummary} · `,
                            `총 `,
                            a.length,
                            `개 차시로 구성되어 있습니다.`,
                          ],
                        }),
                        (0, i.jsx)(`div`, {
                          className: `curriculum`,
                          children: a.map((e, t) =>
                            (0, i.jsxs)(
                              `div`,
                              {
                                className: `curriculum-row`,
                                children: [
                                  (0, i.jsx)(`span`, {
                                    children: String(t + 1).padStart(2, `0`),
                                  }),
                                  (0, i.jsxs)(`div`, {
                                    className: `curriculum-copy`,
                                    children: [
                                      (0, i.jsx)(`b`, { children: e.title }),
                                      (0, i.jsx)(`small`, { children: e.description || `핵심 개념과 실무 활용 방법을 학습합니다.` }),
                                    ],
                                  }),
                                  (0, i.jsx)(`time`, { children: e.duration }),
                                ],
                              },
                              e.title,
                            ),
                          ),
                        }),
                      ],
                    }),
                  }),
            ],
          }),
          (0, i.jsxs)(`aside`, {
            className: `apply-card`,
            children: [
              (0, i.jsx)(`h2`, { children: `수강 정보` }),
              (0, i.jsxs)(`dl`, {
                children: [
                  (0, i.jsxs)(`div`, {
                    children: [
                      (0, i.jsx)(`dt`, { children: `신청 기간` }),
                      (0, i.jsx)(`dd`, { children: `2026.08.01 ~ 08.31` }),
                    ],
                  }),
                  (0, i.jsxs)(`div`, {
                    children: [
                      (0, i.jsx)(`dt`, { children: `교육 기간` }),
                      (0, i.jsx)(`dd`, { children: e.period }),
                    ],
                  }),
                  e.requiredTraining && (0, i.jsxs)(`div`, { children: [(0, i.jsx)(`dt`, { children: `학습 기한` }), (0, i.jsx)(`dd`, { children: e.assignmentDeadline ? `${e.assignmentDeadline.replaceAll(`-`, `.`)}까지` : `기한 없음` })] }),
                ],
              }),
              (0, i.jsx)(`button`, {
                className: `large course-action ${cta.action === `enter` || cta.action === `certificate` ? `enter-course` : `enroll-course`}`,
                disabled: cta.disabled,
                onClick: () => !cta.disabled && n(),
                children: cta.label,
              }),
              (0, i.jsx)(`small`, {
                children: userCourseStatus(e.status) === `오픈 전` ? `${e.startDate ? e.startDate.slice(5).replace(`-`, `월 `) + `일부터` : `운영 시작일부터`} 신청할 수 있습니다.` : userCourseStatus(e.status) === `종료` ? `종료된 과정은 새로 신청할 수 없습니다.` : e.requiredTraining ? `관리자가 배정한 필수 교육입니다.` : `누구나 자유롭게 신청하고 바로 학습할 수 있습니다.`,
              }),
            ],
          }),
        ],
      }),
    ],
  });
}
function ee({ kind: e, course: t, close: n, enroll: r, goLearning: a }) {
  return (0, i.jsx)(`div`, {
    className: `modal-backdrop`,
    onMouseDown: (e) => {
      e.currentTarget === e.target && n();
    },
    children: (0, i.jsxs)(`div`, {
      className: `modal`,
      children: [
        (0, i.jsx)(`button`, {
          className: `modal-close`,
          onClick: n,
          children: (0, i.jsx)(Icon, { icon: Cancel01Icon }),
        }),
        e === `apply`
          ? (0, i.jsxs)(i.Fragment, {
              children: [
                (0, i.jsx)(`span`, { className: `modal-icon`, children: `?` }),
                (0, i.jsx)(`h2`, { children: `수강 신청하시겠습니까?` }),
                (0, i.jsxs)(`p`, {
                  children: [
                    (0, i.jsx)(`b`, { children: t.title }),
                    (0, i.jsx)(`br`, {}),
                    `신청 후 나의 학습에서 바로 시작할 수 있습니다.`,
                  ],
                }),
                (0, i.jsxs)(`div`, {
                  className: `modal-actions`,
                  children: [
                    (0, i.jsx)(`button`, {
                      className: `secondary`,
                      onClick: n,
                      children: `취소`,
                    }),
                    (0, i.jsx)(`button`, {
                      className: `primary`,
                      onClick: r,
                      children: `신청하기`,
                    }),
                  ],
                }),
              ],
            })
          : (0, i.jsxs)(i.Fragment, {
              children: [
                (0, i.jsx)(`span`, {
                  className: `modal-icon success`,
                  children: (0, i.jsx)(Icon, { icon: CheckmarkCircle02Icon }),
                }),
                (0, i.jsx)(`h2`, { children: `수강 신청이 완료되었습니다` }),
                (0, i.jsx)(`p`, {
                  children: `나의 학습에서 과정과 학습 일정을 확인해 주세요.`,
                }),
                (0, i.jsx)(`div`, {
                  className: `modal-actions one`,
                  children: (0, i.jsx)(`button`, {
                    className: `primary`,
                    onClick: a,
                    children: `나의 학습으로 이동`,
                  }),
                }),
              ],
            }),
      ],
    }),
  });
}
function LearningCourseTable({ courses, completed = false, completionDates = [], go, issueCertificate }) {
  return <div className="my-learning-table-wrap">
    <table className="my-learning-table">
      <thead>
        <tr>
          <th>교육과정</th>
          <th>교육 기간</th>
          <th>진도율</th>
          <th>강의 회차</th>
          <th>설문 제출</th>
          <th>학습 상태</th>
          <th>수료일</th>
        </tr>
      </thead>
      <tbody>
        {courses.map((course, index) => {
          const progress = completed ? 100 : course.progress ?? 0;
          const surveyRequired = courseSurveyEnabled(course);
          const surveySubmitted = Boolean(course.surveySubmitted);
          const totalLessons = Number(course.totalLessons ?? course.curriculum?.length ?? 0);
          const completedLessons = Number(course.completedLessons ?? (completed ? totalLessons : 0));
          return <tr key={course.id}>
            <td className="my-learning-course-cell">
              <button onClick={() => go(completed ? `courseDetail` : `lectureDetail`, course.id)}>{course.title}</button>
              {course.requiredTraining && <RequiredTrainingBadge deadline={course.assignmentDeadline} compact completed={completed || isCourseCompleted(course)} />}
              <small>{course.category}</small>
              {completed && <button className="my-learning-certificate" onClick={() => issueCertificate(course)}><Icon icon={Award01Icon} size={14} />수료증 발급 <span>→</span></button>}
            </td>
            <td>{course.period}</td>
            <td className="my-learning-progress-cell"><b>{progress}%</b><span><i style={{ width: `${progress}%` }} /></span></td>
            <td className="my-learning-lessons"><b>{completedLessons}/{totalLessons}</b></td>
            <td><span className={`my-learning-survey ${!surveyRequired ? `none` : surveySubmitted ? `submitted` : `pending`}`}>{!surveyRequired ? `설문 없음` : surveySubmitted ? `제출 완료` : `미제출`}</span></td>
            <td><span className={`my-learning-status ${completed ? `complete` : `active`}`}>{completed ? `수료` : `학습 중`}</span></td>
            <td>{completed ? completionDates[index] : `-`}</td>
          </tr>;
        })}
      </tbody>
    </table>
  </div>;
}
function RewardAvatar({ tone = `blue`, crown = false, small = false }) {
  return <span className={`reward-avatar-3d ${tone} ${small ? `small` : ``}`} aria-hidden="true"><i className="avatar-hair" /><i className="avatar-face" /><i className="avatar-body" />{crown && <i className="avatar-crown" />}</span>;
}
function RewardObject({ type, tone = `violet` }) {
  return <span className={`reward-object-3d ${type} ${tone}`} aria-hidden="true"><i /><b>{type === `coin` ? `P` : ``}</b></span>;
}
function PointCoin({ type = `points`, large = false }) {
  const icons = {
    completion: CheckmarkCircle02Icon,
    course: Award01Icon,
    quiz: Quiz01Icon,
    survey: File01Icon,
  };
  return <span className={`point-coin ${large ? `large` : ``}`} aria-hidden="true">
    {type === `points` ? <b>P</b> : <Icon icon={icons[type] || CheckmarkCircle02Icon} size={large ? 42 : 18} strokeWidth={2.2} />}
  </span>;
}
function MonthlyChallenges() {
  const challenges = [
    { title:`과정 3개 수료`, current:2, total:3, reward:`+100P`, tone:`blue` },
    { title:`퀴즈 5회 완료`, current:4, total:5, reward:`특별 뱃지`, tone:`violet` },
    { title:`3일 연속 학습`, current:3, total:3, reward:`+50P`, tone:`mint`, complete:true },
  ];
  return <section className="monthly-challenge"><header><div><span>MONTHLY CHALLENGE</span><h2>8월 도전</h2><p>작은 목표를 달성하고 추가 보상을 받아보세요.</p></div><RewardObject type="target" tone="pink" /></header><div className="challenge-grid">{challenges.map((challenge) => <article className={`${challenge.tone} ${challenge.complete ? `complete` : ``}`} key={challenge.title}><div><b>{challenge.title}</b><span>{challenge.complete ? `완료` : `${challenge.current} / ${challenge.total}`}</span></div><div className="challenge-track"><i style={{width:`${challenge.current / challenge.total * 100}%`}} /></div><small>보상 <strong>{challenge.reward}</strong></small></article>)}</div></section>;
}
function UserLearningRewards({ initialTab = `ranking` }) {
  const [tab, setTab] = r.useState(initialTab);
  const currentMonth=new Date().toISOString().slice(0,7);
  const [month, setMonth] = r.useState(currentMonth.replace(`-`,`.`));
  const [rewardData,setRewardData]=r.useState({ranking:[],me:{rank:null,name:``,dept:`소속 미지정`,points:0},totalPoints:0,transactions:[],rules:[],badges:[]});
  const [rewardLoading,setRewardLoading]=r.useState(true);
  r.useEffect(()=>{let active=true;setRewardLoading(true);apiRequest(`/api/v1/rewards/me?month=${month.replace(`.`,`-`)}`).then((data)=>{if(active)setRewardData(data);}).catch(()=>{if(active)setRewardData({ranking:[],me:{rank:null,name:``,dept:`소속 미지정`,points:0},totalPoints:0,transactions:[],rules:[],badges:[]});}).finally(()=>{if(active)setRewardLoading(false);});return()=>{active=false;};},[month]);
  const tones=[`coral`,`indigo`,`mint`,`violet`,`orange`,`blue`,`pink`];
  const ranking=(rewardData.ranking||[]).map((person,index)=>({...person,me:person.id===rewardData.me?.id,tone:tones[index%tones.length]}));
  const me=rewardData.me||{rank:null,name:``,dept:`소속 미지정`,points:0};
  const badges=(rewardData.badges||[]).map((badge)=>({type:badge.icon|| (badge.metric===`QUIZ_COMPLETE`?`quiz`:badge.metric===`COURSE_COMPLETE`?`trophy`:`medal`),title:badge.name,condition:badge.description,date:badge.awardedAt?`${new Date(badge.awardedAt).toLocaleDateString(`ko-KR`)} 획득`:`아직 획득하지 않았어요`,tone:badge.tone||`blue`,locked:!badge.awardedAt}));
  const pointHistory=(rewardData.transactions||[]).map((item)=>({type:item.activityType===`COURSE_COMPLETE`?`course`:item.activityType===`QUIZ_COMPLETE`?`quiz`:item.activityType===`SURVEY_SUBMIT`?`survey`:`completion`,label:item.label,detail:item.description,points:item.points,date:new Date(item.createdAt).toLocaleDateString(`ko-KR`,{month:`2-digit`,day:`2-digit`})}));
  const podium=ranking.length>=3?[ranking[1],ranking[0],ranking[2]]:ranking;
  const nextPerson=me.rank&&me.rank>1?ranking.find((person)=>person.rank===me.rank-1):null;
  const tabs = [[`ranking`,RankingIcon,`랭킹`],[`badges`,Award01Icon,`뱃지 컬렉션`],[`points`,SparklesIcon,`포인트`]];
  return <main className="page user-rewards-page reward-game-page">
    <div className="reward-fullbleed-canvas" aria-hidden="true" />
    <div className="reward-confetti" aria-hidden="true">{Array.from({length:14},(_,index) => <i key={index} />)}</div>
    <section className="reward-league-hero">
      <div className="reward-hero-pattern" aria-hidden="true" />
      <div className="reward-league-copy"><nav>홈 <span>›</span> 학습 리워드</nav><span className="reward-season">{month.replace(`.`,` / `)} SEASON</span><h1>{Number(month.slice(5))}월 Learning League</h1><p>이번 달 학습으로 쌓은 성과와 다음 목표를 확인해보세요.</p><div className="reward-hero-score"><span><small>내 순위</small><b>{me.rank?`${me.rank}위`:`-`}</b></span><span><small>학습 포인트</small><b>{Number(me.points||0).toLocaleString()}P</b></span></div></div>
      <article className="reward-me-card"><RewardAvatar tone="indigo" /><div><span>{me.name||`학습자`} · {me.dept||`소속 미지정`}</span><strong>{me.rank?`현재 ${me.rank}위`:`아직 순위가 없습니다`}</strong><small>{rewardLoading?`리워드 정보를 불러오는 중입니다.`:`학습을 완료하면 포인트가 자동 적립됩니다.`}</small></div><div className="next-rank"><p><b>{nextPerson?`${nextPerson.rank}위까지 ${Math.max(0,nextPerson.points-me.points)}P`:`이번 달 누적 포인트`}</b><span>{Number(me.points||0).toLocaleString()}P</span></p><div><i style={{width:nextPerson?`${Math.min(100,Math.round(100*me.points/Math.max(1,nextPerson.points)))}%`:`0%`}} /></div></div></article>
      <div className="reward-hero-object"><RewardObject type="trophy" tone="gold" /><i className="hero-spark one" /><i className="hero-spark two" /></div>
    </section>
    <div className="user-reward-tabs reward-tabs" role="tablist">{tabs.map(([value,icon,label]) => <button key={value} className={tab === value ? `active` : ``} onClick={() => setTab(value)}><Icon icon={icon} size={17} />{label}</button>)}</div>
    {tab === `ranking` && <section className="user-ranking-view reward-ranking-view">
      <div className="user-reward-toolbar"><div><span className="section-eyebrow">LEADERBOARD</span><h2>이번 달 TOP 3</h2><p>꾸준히 학습한 멤버들이 시상대에 올랐어요.</p></div><label className="reward-month-picker"><span>조회 월</span><select aria-label="조회 월" value={month} onChange={(event) => setMonth(event.target.value)}>{Array.from({length:12},(_,index) => <option key={index + 1} value={`2026.${String(index + 1).padStart(2,`0`)}`}>2026년 {index + 1}월</option>)}</select></label></div>
      <div className="reward-podium">{podium.map((person) => <article className={`reward-podium-card rank-${person.rank}`} key={person.id||person.rank}><div className="podium-avatar"><RewardAvatar tone={person.tone} crown={person.rank === 1} /><span>{person.rank}</span></div><div className="podium-card-copy"><em>{person.rank === 1 ? `CHAMPION` : `${person.rank} PLACE`}</em><h3>{person.name}</h3><p>{person.dept}</p><strong>{Number(person.points).toLocaleString()}P</strong><small>{person.courses}개 과정 수료</small></div><div className="podium-base"><b>{person.rank}</b></div></article>)}</div>
      <div className="reward-leaderboard"><header><div><span className="section-eyebrow">ALL RANKING</span><h2>전체 랭킹</h2></div><span>{month.replace(`.`,`년 `)}월</span></header><div className="leaderboard-list">{ranking.length===0?<p className="table-empty">{rewardLoading?`랭킹을 불러오고 있습니다.`:`이번 달 적립된 포인트가 없습니다.`}</p>:ranking.map((person) => <div className={`leaderboard-row ${person.me ? `me` : ``}`} key={person.id||person.rank}><b className="leaderboard-rank">{String(person.rank).padStart(2,`0`)}</b><RewardAvatar tone={person.tone} small /><p><strong>{person.name}{person.me && <em>나</em>}</strong><small>{person.dept}</small></p><strong className="leaderboard-points">{Number(person.points).toLocaleString()}P</strong></div>)}</div></div>
    </section>}
    {tab === `badges` && <section className="user-badge-view reward-badge-view"><div className="user-reward-section-head"><div><span className="section-eyebrow">ACHIEVEMENT COLLECTION</span><h2>나의 뱃지 컬렉션</h2><p>실제 학습 활동을 통해 획득한 뱃지입니다.</p></div><span>{badges.filter((badge)=>!badge.locked).length} / {badges.length}</span></div><div className="reward-badge-grid">{badges.length===0?<p className="table-empty">등록된 뱃지가 없습니다.</p>:badges.map((badge) => <article className={`${badge.tone} ${badge.locked ? `locked` : ``}`} key={badge.title}><span className="badge-rarity">{badge.locked ? `LOCKED` : badge.tone === `gold` ? `LEGENDARY` : `ACHIEVEMENT`}</span><div className="badge-object-wrap"><i className="badge-ring" /><RewardObject type={badge.type} tone={badge.tone} />{badge.locked && <span className="badge-lock"><Icon icon={LockPasswordIcon} size={15} /></span>}</div><small className="badge-state">{badge.locked ? `도전 중` : <><Icon icon={CheckmarkCircle02Icon} size={13} />획득 완료</>}</small><h3>{badge.title}</h3><p>{badge.condition}</p><time>{badge.date}</time></article>)}</div></section>}
    {tab === `points` && <section className="user-point-view reward-point-view"><article className="reward-wallet"><div><span className="section-eyebrow">MY LEARNING WALLET</span><small>나의 학습 포인트</small><strong>{Number(rewardData.totalPoints||0).toLocaleString()}P</strong><p>이번 달 <b>+{Number(me.points||0).toLocaleString()}P</b></p></div><PointCoin large /><i /><i /></article><div className="reward-point-grid"><section className="reward-activity"><div className="user-reward-section-head"><div><h2>최근 적립 내역</h2><p>학습할수록 포인트가 차곡차곡 쌓여요.</p></div></div><div>{pointHistory.length===0?<p className="table-empty">아직 적립된 포인트가 없습니다.</p>:pointHistory.map((item,index) => <article key={`${item.label}-${item.date}-${index}`}><PointCoin type={item.type} /><p><b>{item.label}</b><small>{item.detail}</small></p><strong>+{item.points}P</strong><time>{item.date}</time></article>)}</div></section><section className="reward-rules"><div className="user-reward-section-head"><div><h2>포인트 적립 방법</h2><p>현재 적용 중인 보상 기준이에요.</p></div></div><div>{(rewardData.rules||[]).map((rule) => <article key={rule.activityType}><PointCoin type={rule.activityType===`COURSE_COMPLETE`?`course`:rule.activityType===`QUIZ_COMPLETE`?`quiz`:rule.activityType===`SURVEY_SUBMIT`?`survey`:`completion`} /><b>{rule.label}</b><strong>+{rule.points}P</strong></article>)}</div></section></div></section>}
  </main>;
}
function te({ courses: e, allCourses = [], wishlistIds = [], toggleWishlist, go: t, notify: n }) {
  let [a, o] = (0, r.useState)(`active`),
    [s, c] = (0, r.useState)(null),
    [rewardSummary, setRewardSummary] = (0, r.useState)({ totalPoints:0, monthlyPoints:0 }),
    autoCompleted = e.filter((course) => isCourseCompleted(course)),
    activeCourses = e.filter((course) => !isCourseCompleted(course)),
    l = autoCompleted,
    u = autoCompleted.map((course) => course.completedAt ? new Date(course.completedAt).toLocaleDateString(`ko-KR`) : `-`),
    d = Math.round(
      activeCourses.reduce((e, t) => e + (t.progress ?? 0), 0) / Math.max(activeCourses.length, 1),
    ),
    wishlistCourses = allCourses.filter((course) => wishlistIds.includes(course.id));
  (0, r.useEffect)(() => {
    const month = new Date().toISOString().slice(0,7);
    apiRequest(`/api/v1/rewards/me?month=${month}`).then((data) => setRewardSummary({ totalPoints:Number(data.totalPoints||0), monthlyPoints:Number(data.me?.points||0) })).catch(() => setRewardSummary({ totalPoints:0, monthlyPoints:0 }));
  }, [e]);
  return (0, i.jsxs)(`main`, {
    className: `page my-learning-page`,
    children: [
      (0, i.jsx)(PageHeader, {
        kicker: `나의 학습`,
        title: `나의 학습`,
        description: `수강 중인 과정과 완료한 학습 내역을 확인하세요.`,
        hero: !0,
        heroVariant: `learning`,
      }),
      (0, i.jsxs)(`section`, { className:`my-learning-reward-summary`, children:[
        (0, i.jsxs)(`div`, { children:[(0, i.jsx)(PointCoin, {}),(0, i.jsxs)(`p`, { children:[(0, i.jsx)(`span`, { children:`내 리워드 점수` }),(0, i.jsxs)(`strong`, { children:[rewardSummary.totalPoints.toLocaleString(),`P`] }),(0, i.jsxs)(`small`, { children:[`이번 달 +`,rewardSummary.monthlyPoints.toLocaleString(),`P`] })] })] }),
        (0, i.jsx)(`button`, { className:`secondary`, onClick:()=>t(`userRewards`,`points`), children:`적립 내역 보기` }),
      ] }),
      (0, i.jsxs)(`div`, {
        className: `tabs standalone`,
        role: `tablist`,
        children: [
          (0, i.jsxs)(`button`, {
            className: a === `active` ? `active` : ``,
            onClick: () => o(`active`),
            children: [
              `수강 중인 과정 `,
              (0, i.jsx)(`span`, { children: activeCourses.length }),
            ],
          }),
          (0, i.jsxs)(`button`, {
            className: a === `completed` ? `active` : ``,
            onClick: () => o(`completed`),
            children: [
              `수강 완료 과정 `,
              (0, i.jsx)(`span`, { children: l.length }),
            ],
          }),
          (0, i.jsxs)(`button`, {
            className: a === `wishlist` ? `active` : ``,
            onClick: () => o(`wishlist`),
            children: [
              `찜한 강의 `,
              (0, i.jsx)(`span`, { children: wishlistCourses.length }),
            ],
          }),
        ],
      }),
      a === `active`
        ? (0, i.jsxs)(i.Fragment, {
            children: [
              (0, i.jsxs)(`div`, {
                className: `learning-summary`,
                children: [
                  (0, i.jsxs)(`span`, { children: [`수강 중인 과정 `, activeCourses.length, `개`] }),
                  (0, i.jsxs)(`b`, { children: [`평균 진도율 `, d, `%`] }),
                  (0, i.jsx)(Z, { value: d }),
                ],
              }),
              (0, i.jsx)(LearningCourseTable, { courses: activeCourses, go: t, issueCertificate: c }),
            ],
          })
        : a === `completed`
          ? (0, i.jsx)(LearningCourseTable, { courses: l, completed: true, completionDates: u, go: t, issueCertificate: c })
          : wishlistCourses.length
            ? (0, i.jsx)(`div`, { className: `course-grid my-learning-wishlist-grid`, children: wishlistCourses.map((course) => (0, i.jsx)(Y, { course, go: t, wishlisted: true, onWishlistChange: toggleWishlist }, course.id)) })
            : (0, i.jsxs)(`div`, { className: `my-learning-wishlist-empty`, children: [
                (0, i.jsx)(WishlistHeart, { size: 34 }),
                (0, i.jsx)(`h3`, { children: `아직 찜한 강의가 없어요.` }),
                (0, i.jsx)(`p`, { children: `관심 있는 교육과정을 찜해두면 여기에서 한 번에 확인할 수 있어요.` }),
                (0, i.jsx)(`button`, { className: `primary`, onClick: () => t(`catalog`), children: `교육과정 둘러보기` }),
              ] }),
      s &&
        (0, i.jsx)(`div`, {
          className: `modal-backdrop`,
          children: (0, i.jsxs)(`div`, {
            className: `modal certificate-modal`,
            children: [
              (0, i.jsx)(`button`, {
                className: `modal-close`,
                onClick: () => c(null),
                children: (0, i.jsx)(Icon, { icon: Cancel01Icon }),
              }),
              (0, i.jsx)(P, {}),
              (0, i.jsx)(`p`, {
                className: `certificate-kicker`,
                children: `CERTIFICATE OF COMPLETION`,
              }),
              (0, i.jsx)(`h2`, { children: `수료증` }),
              (0, i.jsxs)(`p`, {
                className: `certificate-number`,
                children: [`제 2026-`, String(s.id).padStart(4, `0`), `호`],
              }),
              (0, i.jsx)(`strong`, { children: `김지수` }),
              (0, i.jsxs)(`p`, {
                children: [
                  `위 사람은 아래 교육과정을 성실히 이수하였으므로`,
                  (0, i.jsx)(`br`, {}),
                  `이 수료증을 수여합니다.`,
                ],
              }),
              (0, i.jsx)(`h3`, { children: s.title }),
              (0, i.jsxs)(`dl`, {
                children: [
                  (0, i.jsxs)(`div`, {
                    children: [
                      (0, i.jsx)(`dt`, { children: `교육 기간` }),
                      (0, i.jsx)(`dd`, { children: s.period }),
                    ],
                  }),
                  (0, i.jsxs)(`div`, {
                    children: [
                      (0, i.jsx)(`dt`, { children: `총 학습 시간` }),
                      (0, i.jsx)(`dd`, { children: s.duration }),
                    ],
                  }),
                ],
              }),
              (0, i.jsxs)(`p`, {
                className: `certificate-date`,
                children: [
                  `2026년 8월 5일`,
                  (0, i.jsx)(`br`, {}),
                  (0, i.jsx)(`b`, { children: `SPARKPLUS 대표이사` }),
                ],
              }),
              (0, i.jsx)(`div`, { className: `stamp`, children: `직인` }),
              (0, i.jsxs)(`div`, {
                className: `modal-actions`,
                children: [
                  (0, i.jsx)(`button`, {
                    className: `secondary`,
                    onClick: () => n(`수료증 인쇄 화면을 준비했습니다.`),
                    children: `인쇄`,
                  }),
                  (0, i.jsx)(`button`, {
                    className: `primary`,
                    onClick: () => n(`수료증 PDF 다운로드가 완료되었습니다.`),
                    children: `PDF 다운로드`,
                  }),
                ],
              }),
            ],
          }),
        }),
    ],
  });
}
function Z({ value: e, small: t = !1 }) {
  return (0, i.jsxs)(`div`, {
    className: `progress-block ${t ? `small` : ``} ${e >= 80 ? `high` : e >= 40 ? `middle` : `low`}`,
    children: [
      (0, i.jsxs)(`div`, {
        children: [
          (0, i.jsx)(`span`, { children: `진도율` }),
          (0, i.jsxs)(`b`, { children: [e, `%`] }),
        ],
      }),
      (0, i.jsx)(`div`, {
        className: `progress-track`,
        children: (0, i.jsx)(`i`, { style: { width: `${e}%` } }),
      }),
    ],
  });
}
function GoogleFormSurveyPage({ course, go }) {
  const responseUrl = googleFormEmbedUrl(course.googleFormUrl || ``);
  const [submitting,setSubmitting]=r.useState(false);
  const [submitError,setSubmitError]=r.useState(``);
  const completeSurvey = async () => {
    if(!course.enrollmentId)return;
    setSubmitting(true);
    setSubmitError(``);
    try{const result=await apiRequest(`/api/v1/learning/enrollments/${course.enrollmentId}/survey`,{method:`POST`});showAdminToast(result.completed?`설문 제출과 과정 수료가 완료되었습니다.`:`설문 제출이 반영되었습니다.`);}
    catch(error){setSubmitError(`설문 완료 상태를 저장하지 못했습니다. 잠시 후 다시 눌러주세요.`);return showAdminToast(`설문 완료 상태를 저장하지 못했습니다.`,`error`);}
    finally{setSubmitting(false);}
    window.dispatchEvent(new CustomEvent(`sparkplus-course-progress`, { detail: { courseId: course.id } }));
    await go(`lectureDetail`, course.id);
  };
  return (
    <main className="page google-form-user-page">
      <div className="breadcrumb"><button onClick={() => go(`lectureDetail`, course.id)}>나의 학습</button><span>›</span>수료 후 설문</div>
      <header className="google-form-user-head"><h1>수료 후 설문</h1>{responseUrl && <a href={responseUrl.replace(`?embedded=true`, ``)} target="_blank" rel="noreferrer">새 창에서 열기 ↗</a>}</header>
      {responseUrl ? <iframe className="google-form-user-frame" src={responseUrl} title={`${course.title} 수료 후 설문`} /> : <div className="home-data-empty">관리자가 연결한 Google Forms 설문이 없습니다.</div>}
      <div className="google-form-complete-bar"><div><b>Google Forms 설문을 제출하셨나요?</b><span>Google Forms와 LMS는 별도 시스템이므로 제출 후 이 버튼을 눌러 수료 처리해 주세요.</span>{submitError&&<em className="survey-submit-error">{submitError}</em>}</div><button className="primary" disabled={submitting||!responseUrl} onClick={completeSurvey}><Icon icon={CheckmarkCircle02Icon} size={17} />{submitting?`수료 처리 중…`:`설문 완료 및 수료 처리`}</button></div>
    </main>
  );
}

function LectureDetailQuest({ course, go, user }) {
  const lessons = course.curriculum || k[course.id] || [];
  const [certificateOpen, setCertificateOpen] = r.useState(false);
  const lessonRequirementComplete = (lesson) => Boolean(lesson.completed) && (!(lesson.quiz?.length) || lesson.quiz.every((question) => question.correctlyAnswered));
  const allLessonsComplete = lessons.length > 0 && lessons.every(lessonRequirementComplete);
  const surveyComplete = Boolean(course.surveySubmitted);
  const surveyRequired = courseSurveyEnabled(course);
  const completedLessons = lessons.filter(lessonRequirementComplete).length;
  const currentIndex = allLessonsComplete ? -1 : Math.max(0,lessons.findIndex((lesson)=>!lessonRequirementComplete(lesson)));
  const completedQuestCount = completedLessons + (surveyRequired && surveyComplete ? 1 : 0);
  const totalQuestCount = lessons.length + (surveyRequired ? 1 : 0);
  const remaining = Math.max(0, totalQuestCount - completedQuestCount);
  const certificateReady = allLessonsComplete && (!surveyRequired || surveyComplete);
  const openLesson = (index) => {
    sessionStorage.setItem(`sparkplus-active-lesson-${course.id}`, String(index));
    go(`player`, course.id);
  };
  return <main className="page lecture-quest-page">
    <div className="breadcrumb"><button onClick={() => go(`learning`)}>나의 학습</button><span>›</span>강의 상세</div>
    <section className="lecture-hero"><J accent={course.accent} label={course.category} /><div className="lecture-hero-copy"><div><span className="badge blue-badge">{course.category}</span><span className={`level-badge ${userLevelTone(course.level)}`}>{userLevelLabel(course.level)}</span></div><h1>{course.title}</h1><p>{course.description}</p><div className="lecture-meta"><span><small>교육 기간</small><b>{course.period}</b></span><span><small>전체 학습 시간</small><b>{course.duration}</b></span></div><div className="lecture-primary-actions"><button className="primary" onClick={() => openLesson(currentIndex < 0 ? lessons.length - 1 : currentIndex)}>{allLessonsComplete ? `강의 다시 보기` : `학습 이어가기`}</button></div></div></section>
    <section className="completion-quest-card"><header className="quest-head"><div><span>LEARNING QUEST</span><h2>{remaining === 0 ? `모든 수료 조건을 완료했어요!` : `수료까지 ${remaining}단계 남았어요`}</h2><p>각 차시의 영상 학습과 퀴즈 정답 제출{surveyRequired ? `, 마지막 설문 제출` : ``}까지 완료하면 자동 수료됩니다.</p></div><div className="quest-progress-copy"><strong>{completedQuestCount} / {totalQuestCount}</strong><span>완료</span></div></header><div className="quest-progress-track" aria-label={`수료 진행도 ${completedQuestCount}/${totalQuestCount}`}><i style={{width:`${completedQuestCount / Math.max(totalQuestCount,1) * 100}%`}} /></div>
      <div className="completion-rule-summary" aria-label="과정 수료 조건"><b>수료 조건</b><span><Icon icon={CheckmarkCircle02Icon} size={16} /> 모든 영상 학습 완료</span><span><Icon icon={Quiz01Icon} size={16} /> 차시별 퀴즈 정답 제출</span>{surveyRequired && <span><Icon icon={CheckmarkCircle02Icon} size={16} /> 설문 제출 후 LMS에서 완료 확인</span>}</div>
      <div className="quest-list">{lessons.map((lesson,index) => { const videoComplete = Boolean(lesson.completed); const quizRequired = Boolean(lesson.quiz?.length); const quizComplete = !quizRequired || lesson.quiz.every((question) => question.correctlyAnswered); const complete = videoComplete && quizComplete; const current = index === currentIndex; const state = complete ? `complete` : current ? `current` : `pending`; const missing = !videoComplete ? `영상 학습 필요` : !quizComplete ? `퀴즈 정답 제출 필요` : ``; return <button className={`quest-item ${state}`} key={lesson.id||lesson.title} onClick={() => openLesson(index)}><span className="quest-state">{complete ? <Icon icon={CheckmarkCircle02Icon} size={19} /> : current ? <Icon icon={PlayIcon} size={17} /> : <i />}</span><span className="quest-number">{String(index + 1).padStart(2,`0`)}</span><span className="quest-copy"><b>{lesson.title}</b><small><span className={videoComplete ? `done` : ``}>영상 {videoComplete ? `완료` : `미완료`}</span>{quizRequired && <> · <span className={quizComplete ? `done` : ``}>퀴즈 {quizComplete ? `완료` : `미완료`}</span></>}</small></span><em>{complete ? `완료` : missing}</em><span className="quest-arrow">›</span></button>; })}</div>
      {surveyRequired && <div className={`survey-quest-step ${surveyComplete ? `complete` : allLessonsComplete ? `available` : `locked`}`}><span className="quest-state">{surveyComplete ? <Icon icon={CheckmarkCircle02Icon} size={20} /> : <i />}</span><div><small>마지막 단계</small><h3>수료 후 설문</h3><p>{surveyComplete ? `설문 제출이 완료되었습니다.` : allLessonsComplete ? `학습 경험에 대한 간단한 설문을 작성해주세요.` : `모든 차시를 완료하면 설문에 참여할 수 있습니다.`}</p></div>{surveyComplete ? <span className="survey-done">설문 완료</span> : <button disabled={!allLessonsComplete} onClick={() => go(`courseSurvey`,course.id)}>설문하기 <span>→</span></button>}</div>}
      <div className={`certificate-quest ${certificateReady ? `ready` : `locked`}`}><span className="certificate-quest-icon"><Icon icon={Award01Icon} size={27} /></span><div><h3>{certificateReady ? `모든 수료 조건을 완료했어요!` : `수료증 발급`}</h3><p>{certificateReady ? `지금 바로 수료증을 확인하고 발급할 수 있습니다.` : surveyRequired ? `모든 차시와 설문을 완료하면 발급할 수 있습니다.` : `모든 차시를 완료하면 발급할 수 있습니다.`}</p></div><button className={certificateReady ? `primary` : ``} disabled={!certificateReady} onClick={() => setCertificateOpen(true)}>수료증 발급</button></div>
    </section>
    {certificateOpen && <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setCertificateOpen(false)}><section className="modal certificate-modal quest-certificate-modal"><button className="modal-close" onClick={() => setCertificateOpen(false)}><Icon icon={Cancel01Icon} /></button><P /><p className="certificate-kicker">CERTIFICATE OF COMPLETION</p><h2>수료증</h2><p className="certificate-number">{course.certificateNumber || `수료 처리 중`}</p><strong>{user?.name || `학습자`}</strong><p>위 사람은 아래 교육과정을 성실히 이수하였으므로<br />이 수료증을 수여합니다.</p><h3>{course.title}</h3><dl><div><dt>교육 기간</dt><dd>{course.period}</dd></div><div><dt>총 학습 시간</dt><dd>{course.duration}</dd></div></dl><p className="certificate-date">{course.completedAt ? new Date(course.completedAt).toLocaleDateString(`ko-KR`) : new Date().toLocaleDateString(`ko-KR`)}<br /><b>SPARKPLUS</b></p><div className="stamp">직인</div><div className="modal-actions"><button className="secondary" onClick={() => window.print()}>인쇄</button><button className="primary" onClick={() => window.print()}>PDF 저장</button></div></section></div>}
  </main>;
}

function ne({ course: e, go: t }) {
  let n = k[e.id] ?? [],
    r = e.progress ?? 0,
    a = Math.min(n.length, Math.floor(r / 20)),
    o = n.map((e, t) => ({
      ...e,
      status: t < a ? `수강 완료` : t === a ? `수강 중` : `미수강`,
    }));
  return (0, i.jsxs)(`main`, {
    className: `page`,
    children: [
      (0, i.jsxs)(`div`, {
        className: `breadcrumb`,
        children: [
          (0, i.jsx)(`button`, {
            onClick: () => t(`learning`),
            children: `나의 학습`,
          }),
          (0, i.jsx)(`span`, { children: `›` }),
          `강의 상세`,
        ],
      }),
      (0, i.jsxs)(`section`, {
        className: `lecture-hero`,
        children: [
          (0, i.jsx)(J, { accent: e.accent, label: e.category }),
          (0, i.jsxs)(`div`, {
            className: `lecture-hero-copy`,
            children: [
              (0, i.jsxs)(`div`, {
                children: [
                  (0, i.jsx)(`span`, {
                    className: `badge blue-badge`,
                    children: e.category,
                  }),
                  (0, i.jsx)(`span`, {
                    className: `level-badge ${userLevelTone(e.level)}`,
                    children: userLevelLabel(e.level),
                  }),
                ],
              }),
              (0, i.jsx)(`h1`, { children: e.title }),
              (0, i.jsx)(`p`, { children: e.description }),
              (0, i.jsxs)(`div`, {
                className: `lecture-meta`,
                children: [
                  (0, i.jsxs)(`span`, {
                    children: [
                      (0, i.jsx)(`small`, { children: `교육 기간` }),
                      (0, i.jsx)(`b`, { children: e.period }),
                    ],
                  }),
                  (0, i.jsxs)(`span`, {
                    children: [
                      (0, i.jsx)(`small`, { children: `전체 학습 시간` }),
                      (0, i.jsx)(`b`, { children: e.duration }),
                    ],
                  }),
                ],
              }),
              (0, i.jsxs)(`div`, {
                className: `lecture-progress`,
                children: [
                  (0, i.jsxs)(`div`, {
                    children: [
                      (0, i.jsx)(`span`, { children: `전체 진도율` }),
                      (0, i.jsxs)(`b`, { children: [r, `%`] }),
                    ],
                  }),
                  (0, i.jsx)(Z, { value: r }),
                ],
              }),
              (0, i.jsxs)(`div`, { className: `lecture-primary-actions`, children: [
                (0, i.jsx)(`button`, { className: `primary`, onClick: () => t(`player`, e.id), children: `학습 이어가기` }),
                r >= 100 && (0, i.jsx)(`button`, { className: `secondary`, onClick: () => t(`courseSurvey`, e.id), children: `수료 후 설문` }),
              ] }),
            ],
          }),
        ],
      }),
      (0, i.jsxs)(`div`, {
        className: `lesson-status-guide`,
        children: [
          (0, i.jsxs)(`span`, {
            children: [
              (0, i.jsx)(`i`, {
                className: `complete`,
                children: (0, i.jsx)(Icon, { icon: CheckmarkCircle02Icon }),
              }),
              ` 수강 완료 `,
              (0, i.jsx)(`b`, { children: a }),
            ],
          }),
          (0, i.jsxs)(`span`, {
            children: [
              (0, i.jsx)(`i`, { className: `current`, children: `▶` }),
              ` 수강 중 `,
              (0, i.jsx)(`b`, { children: +(a < n.length) }),
            ],
          }),
          (0, i.jsxs)(`span`, {
            children: [
              (0, i.jsx)(`i`, { className: `not-started`, children: `–` }),
              ` 미수강 `,
              (0, i.jsx)(`b`, { children: Math.max(0, n.length - a - 1) }),
            ],
          }),
        ],
      }),
      (0, i.jsxs)(`div`, {
        className: `lecture-grid`,
        children: [
          (0, i.jsxs)(`section`, {
            className: `card span-2`,
            children: [
              (0, i.jsx)(B, {
                title: `전체 커리큘럼`,
                action: (0, i.jsxs)(`span`, {
                  className: `course-count`,
                  children: [a, `/`, n.length, ` 차시 완료`],
                }),
              }),
              (0, i.jsx)(`div`, {
                className: `lesson-list`,
                children: o.map((n, r) =>
                  (0, i.jsxs)(
                    `button`,
                    {
                      className: `lesson-${n.status === `수강 완료` ? `complete` : n.status === `수강 중` ? `current` : `not-started`}`,
                      onClick: () => t(`player`, e.id),
                      children: [
                        (0, i.jsx)(`span`, {
                          className: `lesson-state ${n.status === `수강 완료` ? `complete` : n.status === `수강 중` ? `current` : `not-started`}`,
                          children:
                            n.status === `수강 완료`
                              ? `✓`
                              : n.status === `수강 중`
                                ? `▶`
                                : r + 1,
                        }),
                        (0, i.jsxs)(`div`, {
                          children: [
                            (0, i.jsxs)(`small`, { children: [r + 1, `차시`] }),
                            (0, i.jsx)(`b`, { children: n.title }),
                            (0, i.jsxs)(`span`, {
                              children: [`영상 · `, n.duration],
                            }),
                          ],
                        }),
                        (0, i.jsx)(`em`, {
                          className: `state-label ${n.status === `수강 완료` ? `complete` : n.status === `수강 중` ? `current` : `not-started`}`,
                          children: n.status,
                        }),
                        (0, i.jsx)(`i`, { children: `›` }),
                      ],
                    },
                    n.title,
                  ),
                ),
              }),
            ],
          }),
          (0, i.jsxs)(`aside`, {
            children: [
              (0, i.jsxs)(`section`, {
                className: `card`,
                children: [
                  (0, i.jsx)(B, { title: `과정 공지` }),
                  (0, i.jsx)(H, {
                    title: `3차시 실습 자료가 업데이트되었습니다.`,
                    date: `08.04`,
                  }),
                  (0, i.jsx)(H, {
                    title: `학습 마감일을 확인해 주세요.`,
                    date: `07.30`,
                  }),
                ],
              }),
              (0, i.jsxs)(`section`, {
                className: `card file-card`,
                children: [
                  (0, i.jsx)(B, { title: `첨부 자료` }),
                  (0, i.jsxs)(`button`, {
                    children: [
                      (0, i.jsx)(`span`, { children: `PDF` }),
                      (0, i.jsxs)(`div`, {
                        children: [
                          (0, i.jsxs)(`b`, {
                            children: [e.category, ` 학습 자료.pdf`],
                          }),
                          (0, i.jsx)(`small`, { children: `2.4MB` }),
                        ],
                      }),
                      (0, i.jsx)(`em`, {
                        children: (0, i.jsx)(Icon, { icon: Download01Icon }),
                      }),
                    ],
                  }),
                  (0, i.jsxs)(`button`, {
                    children: [
                      (0, i.jsx)(`span`, { children: `XLS` }),
                      (0, i.jsxs)(`div`, {
                        children: [
                          (0, i.jsx)(`b`, { children: `실습 자료.xlsx` }),
                          (0, i.jsx)(`small`, { children: `820KB` }),
                        ],
                      }),
                      (0, i.jsx)(`em`, {
                        children: (0, i.jsx)(Icon, { icon: Download01Icon }),
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });
}
function re({
  course: e,
  go: t,
  lessonOpen: n,
  setLessonOpen: a,
  playing: o,
  setPlaying: s,
  videoProgress: c,
  saveProgress: l,
}) {
  return <ClassroomPlayer course={e} lessons={e.curriculum || k[e.id] || []} go={t} lessonOpen={n} setLessonOpen={a} playing={o} setPlaying={s} videoProgress={c} saveProgress={l} />;
  let [quizAnswer, setQuizAnswer] = (0, r.useState)(null),
    [quizDone, setQuizDone] = (0, r.useState)(!1),
    [u, d] = (0, r.useState)(`goals`),
    f = k[e.id] ?? [],
    p = e.id === 6,
    m = p ? 0 : 2,
    h = f.map((e, t) => ({
      ...e,
      status: t < m ? `수강 완료` : t === m ? `수강 중` : `미수강`,
    })),
    g = h[m] ?? { title: `현재 차시`, duration: `32분`, status: `수강 중` };
  return (0, i.jsxs)(`main`, {
    className: `player-page ${n ? `sidebar-open` : ``}`,
    children: [
      (0, i.jsxs)(`aside`, {
        className: `lesson-sidebar`,
        children: [
          (0, i.jsxs)(`div`, {
            className: `sidebar-head`,
            children: [
              (0, i.jsxs)(`div`, {
                children: [
                  (0, i.jsx)(`small`, { children: e.category }),
                  (0, i.jsx)(`b`, { children: e.title }),
                ],
              }),
              (0, i.jsx)(`button`, {
                onClick: () => a(!1),
                children: (0, i.jsx)(Icon, { icon: Cancel01Icon }),
              }),
            ],
          }),
          (0, i.jsx)(`div`, {
            className: `side-progress`,
            children: (0, i.jsx)(Z, { value: e.progress ?? 0 }),
          }),
          (0, i.jsx)(`div`, {
            className: `sidebar-lessons`,
            children: h.map((e, t) =>
              (0, i.jsxs)(
                `button`,
                {
                  className: t === m ? `current` : ``,
                  children: [
                    (0, i.jsx)(`span`, {
                      className: e.status === `수강 완료` ? `completed` : ``,
                      children: e.status === `수강 완료` ? `✓` : t + 1,
                    }),
                    (0, i.jsxs)(`div`, {
                      children: [
                        (0, i.jsxs)(`small`, {
                          children: [t + 1, `차시 · `, e.status],
                        }),
                        (0, i.jsx)(`b`, { children: e.title }),
                        (0, i.jsx)(`em`, { children: e.duration }),
                      ],
                    }),
                  ],
                },
                e.title,
              ),
            ),
          }),
        ],
      }),
      (0, i.jsxs)(`section`, {
        className: `player-main`,
        children: [
          !n &&
            (0, i.jsx)(`button`, {
              className: `open-sidebar`,
              onClick: () => a(!0),
              children: [(0, i.jsx)(Icon, { icon: Menu01Icon }), `차시 목록`],
            }),
          (0, i.jsxs)(`div`, {
            className: `player-head`,
            children: [
              (0, i.jsxs)(`div`, {
                children: [
                  (0, i.jsxs)(`span`, { children: [m + 1, `차시`] }),
                  (0, i.jsx)(`h1`, { children: g.title }),
                ],
              }),
              (0, i.jsx)(`button`, {
                className: `secondary exit-classroom`,
                onClick: () => t(`lectureDetail`, e.id),
                children: `← 강의실 나가기`,
              }),
            ],
          }),
          p
            ? (0, i.jsx)(`div`, {
                className: `video youtube-embed`,
                children: (0, i.jsx)(`iframe`, {
                  src: `https://www.youtube-nocookie.com/embed/P8pEFQBXbKI?rel=0`,
                  title: `생성형 AI와 업무 혁신 강의 영상`,
                  allow: `accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share`,
                  referrerPolicy: `strict-origin-when-cross-origin`,
                  allowFullScreen: !0,
                }),
              })
            : (0, i.jsxs)(`div`, {
                className: `video`,
                children: [
                  (0, i.jsxs)(`div`, {
                    className: `video-art`,
                    children: [
                      (0, i.jsxs)(`div`, {
                        className: `data-card`,
                        children: [
                          (0, i.jsx)(`span`, {
                            children: String(m + 1).padStart(2, `0`),
                          }),
                          (0, i.jsx)(`h2`, { children: g.title }),
                          (0, i.jsxs)(`p`, {
                            children: [
                              e.category,
                              ` 업무에 바로 적용할 수 있는 핵심 내용을 학습합니다.`,
                            ],
                          }),
                        ],
                      }),
                      (0, i.jsx)(`button`, {
                        className: `play`,
                        onClick: () => s(!o),
                        children: (0, i.jsx)(Icon, {
                          icon: o ? Cancel01Icon : PlayIcon,
                          size: 22,
                        }),
                      }),
                    ],
                  }),
                  (0, i.jsxs)(`div`, {
                    className: `video-controls`,
                    children: [
                      (0, i.jsx)(`button`, {
                        onClick: () => s(!o),
                        children: (0, i.jsx)(Icon, {
                          icon: o ? Cancel01Icon : PlayIcon,
                        }),
                      }),
                      (0, i.jsxs)(`span`, {
                        children: [`08:42 / `, g.duration],
                      }),
                      (0, i.jsx)(`div`, {
                        className: `video-track`,
                        children: (0, i.jsx)(`i`, {
                          style: { width: `${c}%` },
                        }),
                      }),
                      (0, i.jsx)(`button`, { children: `1.0x` }),
                      (0, i.jsx)(`button`, { children: `♩` }),
                      (0, i.jsx)(`button`, { children: `⛶` }),
                    ],
                  }),
                ],
              }),
          (0, i.jsxs)(`div`, {
            className: `auto-save`,
            children: [
              (0, i.jsx)(`span`, {
                children: (0, i.jsx)(Icon, { icon: CheckmarkCircle02Icon }),
              }),
              (0, i.jsxs)(`p`, {
                children: [
                  (0, i.jsx)(`b`, {
                    children: p
                      ? `영상 학습 후 진도 저장 버튼을 눌러주세요.`
                      : `학습 진도는 자동으로 저장됩니다.`,
                  }),
                  (0, i.jsx)(`small`, {
                    children: p
                      ? `저장된 진도는 나의 학습 현황에 반영됩니다.`
                      : `창을 닫기 전 수동으로 저장할 수도 있습니다.`,
                  }),
                ],
              }),
            ],
          }),
          (0, i.jsxs)(`div`, {
            className: `player-tabs`,
            role: `tablist`,
            children: [
              (0, i.jsx)(`button`, {
                className: u === `goals` ? `active` : ``,
                onClick: () => d(`goals`),
                children: `학습 목표`,
              }),
              (0, i.jsx)(`button`, {
                className: u === `contents` ? `active` : ``,
                onClick: () => d(`contents`),
                children: `주요 내용`,
              }),
              (0, i.jsxs)(`button`, {
                className: u === `files` ? `active` : ``,
                onClick: () => d(`files`),
                children: [`첨부 자료 `, (0, i.jsx)(`span`, { children: `2` })],
              }),
              (0, i.jsx)(`button`, {
                className: u === `memo` ? `active` : ``,
                onClick: () => d(`memo`),
                children: `학습 메모`,
              }),
              (0, i.jsxs)(`button`, {
                className: u === `quiz` ? `active ai-quiz-tab` : `ai-quiz-tab`,
                onClick: () => d(`quiz`),
                children: [`AI 퀴즈 `, (0, i.jsx)(`span`, { children: `NEW` })],
              }),
            ],
          }),
          (0, i.jsxs)(`div`, {
            className: `player-tab-content`,
            children: [
              u === `goals` &&
                (0, i.jsxs)(`div`, {
                  className: `lesson-info`,
                  children: [
                    (0, i.jsx)(`h3`, { children: `이번 차시 학습 목표` }),
                    (0, i.jsxs)(`ul`, {
                      children: [
                        (0, i.jsxs)(`li`, {
                          children: [
                            g.title,
                            `의 핵심 개념을 이해할 수 있습니다.`,
                          ],
                        }),
                        (0, i.jsx)(`li`, {
                          children: `주요 원칙과 판단 기준을 실제 업무 상황에 적용할 수 있습니다.`,
                        }),
                        (0, i.jsx)(`li`, {
                          children: `학습 내용을 바탕으로 스스로 업무 개선 방법을 찾을 수 있습니다.`,
                        }),
                      ],
                    }),
                  ],
                }),
              u === `contents` &&
                (0, i.jsxs)(`div`, {
                  className: `lesson-info`,
                  children: [
                    (0, i.jsx)(`h3`, { children: `주요 내용` }),
                    (0, i.jsxs)(`ol`, {
                      children: [
                        (0, i.jsx)(`li`, {
                          children: `핵심 개념과 실무에서 자주 마주치는 상황`,
                        }),
                        (0, i.jsx)(`li`, {
                          children: `단계별 적용 방법과 확인해야 할 기준`,
                        }),
                        (0, i.jsx)(`li`, {
                          children: `사례를 통한 실전 적용과 주의사항`,
                        }),
                      ],
                    }),
                  ],
                }),
              u === `files` &&
                (0, i.jsxs)(`div`, {
                  className: `player-files`,
                  children: [
                    (0, i.jsxs)(`button`, {
                      children: [
                        (0, i.jsx)(`span`, { children: `PDF` }),
                        (0, i.jsxs)(`div`, {
                          children: [
                            (0, i.jsxs)(`b`, {
                              children: [e.category, ` 학습 자료.pdf`],
                            }),
                            (0, i.jsx)(`small`, { children: `2.4MB` }),
                          ],
                        }),
                        (0, i.jsx)(`em`, {
                          children: [
                            (0, i.jsx)(Icon, { icon: Download01Icon }),
                            `다운로드`,
                          ],
                        }),
                      ],
                    }),
                    (0, i.jsxs)(`button`, {
                      children: [
                        (0, i.jsx)(`span`, { children: `XLS` }),
                        (0, i.jsxs)(`div`, {
                          children: [
                            (0, i.jsx)(`b`, {
                              children: `차시 실습 자료.xlsx`,
                            }),
                            (0, i.jsx)(`small`, { children: `820KB` }),
                          ],
                        }),
                        (0, i.jsx)(`em`, {
                          children: [
                            (0, i.jsx)(Icon, { icon: Download01Icon }),
                            `다운로드`,
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
              u === `memo` &&
                (0, i.jsx)(`textarea`, {
                  placeholder: `학습하면서 기억하고 싶은 내용을 자유롭게 메모해 보세요.`,
                }),
              u === `quiz` &&
                (0, i.jsxs)(`div`, {
                  className: `ai-quiz-panel`,
                  children: [
                    (0, i.jsxs)(`div`, {
                      className: `ai-quiz-head`,
                      children: [
                        (0, i.jsx)(`span`, {
                          children: (0, i.jsx)(Icon, {
                            icon: SparklesIcon,
                            size: 23,
                          }),
                        }),
                        (0, i.jsxs)(`div`, {
                          children: [
                            (0, i.jsx)(`h3`, {
                              children: `강의 내용 확인 퀴즈`,
                            }),
                            (0, i.jsx)(`p`, {
                              children: `현재 영상과 학습 자료를 바탕으로 생성된 문제입니다.`,
                            }),
                          ],
                        }),
                      ],
                    }),
                    (0, i.jsx)(`b`, {
                      className: `quiz-question`,
                      children: `Q1. 이번 차시의 핵심 내용을 업무에 적용할 때 가장 먼저 해야 할 일은 무엇인가요?`,
                    }),
                    (0, i.jsx)(`div`, {
                      className: `quiz-options`,
                      children: [
                        `목표와 현재 상황을 확인한다`,
                        `도구부터 새로 구매한다`,
                        `모든 업무를 한 번에 변경한다`,
                        `검토 없이 바로 실행한다`,
                      ].map((e, t) =>
                        (0, i.jsx)(
                          `button`,
                          {
                            className: quizAnswer === t ? `selected` : ``,
                            onClick: () => {
                              (setQuizAnswer(t), setQuizDone(!1));
                            },
                            children: e,
                          },
                          e,
                        ),
                      ),
                    }),
                    (0, i.jsx)(`button`, {
                      className: `primary quiz-submit`,
                      disabled: quizAnswer === null,
                      onClick: () => setQuizDone(!0),
                      children: `정답 확인`,
                    }),
                    quizDone &&
                      (0, i.jsxs)(`div`, {
                        className:
                          quizAnswer === 0
                            ? `quiz-result correct`
                            : `quiz-result wrong`,
                        children: [
                          (0, i.jsx)(`b`, {
                            children:
                              quizAnswer === 0
                                ? `정답입니다!`
                                : `다시 한번 생각해 보세요.`,
                          }),
                          (0, i.jsx)(`span`, {
                            children:
                              quizAnswer === 0
                                ? `목표와 현재 상황을 먼저 파악해야 적절한 적용 방법을 선택할 수 있습니다.`
                                : `강의의 핵심 원칙은 목표와 현재 상황을 먼저 확인하는 것입니다.`,
                          }),
                        ],
                      }),
                  ],
                }),
            ],
          }),
          (0, i.jsxs)(`div`, {
            className: `player-actions`,
            children: [
              (0, i.jsx)(`button`, {
                className: `secondary`,
                children: `← 이전 차시`,
              }),
              (0, i.jsx)(`button`, {
                className: `secondary save`,
                onClick: l,
                children: `진도 저장`,
              }),
              (0, i.jsx)(`button`, {
                className: `primary`,
                onClick: l,
                children: `다음 차시 →`,
              }),
            ],
          }),
        ],
      }),
    ],
  });
}
function ie({ go: e, notices = j }) {
  let [t, n] = (0, r.useState)(``),
    s = notices.filter((e) => !t || e.title.includes(t));
  return (0, i.jsxs)(`main`, {
    className: `page user-notice-page`,
    children: [
      (0, i.jsx)(PageHeader, {
        kicker: `공지사항`,
        title: `공지사항`,
        description: `교육 운영과 시스템 이용에 필요한 소식을 확인하세요.`,
        hero: !0,
        heroVariant: `notices`,
      }),
      (0, i.jsxs)(`section`, {
        className: `notice-search`,
        children: [
          (0, i.jsxs)(`div`, {
            className: `search-wrap`,
            children: [
              (0, i.jsx)(Icon, { icon: Search01Icon }),
              (0, i.jsx)(`input`, {
                value: t,
                onChange: (e) => n(e.target.value),
                placeholder: `공지사항 제목을 검색해 주세요`,
              }),
            ],
          }),
          (0, i.jsx)(`button`, { className: `primary`, children: `검색` }),
        ],
      }),
      (0, i.jsxs)(`div`, {
        className: `notice-result`,
        children: [
          `총 `,
          (0, i.jsx)(`b`, { children: s.length }),
          `개의 공지사항`,
        ],
      }),
      (0, i.jsxs)(`section`, {
        className: `notice-table`,
        children: [
          (0, i.jsxs)(`div`, {
            className: `notice-table-head`,
            children: [
              (0, i.jsx)(`span`, { children: `제목` }),
              (0, i.jsx)(`span`, { children: `등록일` }),
              (0, i.jsx)(`span`, { children: `조회수` }),
            ],
          }),
          s.map((t) =>
            (0, i.jsxs)(
              `button`,
              {
                className: t.important ? `notice-important-row` : ``,
                onClick: () => e(`noticeDetail`, t.id),
                children: [
                  (0, i.jsxs)(`span`, {
                    className: `notice-title-cell`,
                    children: [
                      t.important && (0, i.jsx)(NoticePin, {}),
                      t.title,
                    ],
                  }),
                  (0, i.jsx)(`span`, { children: t.date }),
                  (0, i.jsx)(`span`, { children: t.views }),
                ],
              },
              t.id,
            ),
          ),
          s.length === 0 &&
            (0, i.jsx)(`div`, {
              className: `notice-empty`,
              children: `검색 결과가 없습니다.`,
            }),
        ],
      }),
      (0, i.jsxs)(`div`, {
        className: `pagination`,
        children: [
          (0, i.jsx)(`button`, { children: `‹` }),
          (0, i.jsx)(`button`, { className: `selected`, children: `1` }),
          (0, i.jsx)(`button`, { children: `2` }),
          (0, i.jsx)(`button`, { children: `›` }),
        ],
      }),
    ],
  });
}
function ae({ notice: e, go: t, notices = j }) {
  let n = notices.findIndex((t) => t.id === e.id),
    r = notices[n - 1],
    a = notices[n + 1];
  return (0, i.jsxs)(`main`, {
    className: `page`,
    children: [
      (0, i.jsxs)(`div`, {
        className: `breadcrumb`,
        children: [
          (0, i.jsx)(`button`, {
            onClick: () => t(`noticeList`),
            children: `공지사항`,
          }),
          (0, i.jsx)(`span`, { children: `›` }),
          `공지 상세`,
        ],
      }),
      (0, i.jsxs)(`article`, {
        className: `notice-detail`,
        children: [
          (0, i.jsxs)(`div`, {
            className: `notice-detail-head`,
            children: [
              e.important && (0, i.jsx)(NoticePin, { label: true }),
              (0, i.jsx)(`h1`, { children: e.title }),
              (0, i.jsxs)(`p`, {
                children: [
                  (0, i.jsxs)(`span`, { children: [`등록일 `, e.date] }),
                  (0, i.jsxs)(`span`, { children: [`조회수 `, e.views] }),
                ],
              }),
            ],
          }),
          (0, i.jsxs)(`div`, {
            className: `notice-detail-body`,
            children: [
              (0, i.jsx)(`p`, { children: e.content }),
              (0, i.jsx)(`p`, {
                children: `교육 일정과 학습 진행에 착오가 없도록 내용을 확인해 주시기 바랍니다. 문의 사항은 인재개발팀으로 전달해 주세요.`,
              }),
            ],
          }),
          e.file &&
            (0, i.jsxs)(`div`, {
              className: `notice-attachment`,
              children: [
                (0, i.jsx)(`b`, { children: `첨부파일` }),
                (0, i.jsxs)(`button`, {
                  children: [
                    (0, i.jsx)(`span`, { children: `PDF` }),
                    (0, i.jsxs)(`div`, {
                      children: [
                        (0, i.jsx)(`strong`, { children: e.file }),
                        (0, i.jsx)(`small`, { children: `1.8MB` }),
                      ],
                    }),
                    (0, i.jsx)(`em`, {
                      children: [
                        (0, i.jsx)(Icon, { icon: Download01Icon }),
                        `다운로드`,
                      ],
                    }),
                  ],
                }),
              ],
            }),
        ],
      }),
      (0, i.jsxs)(`div`, {
        className: `notice-navigation`,
        children: [
          (0, i.jsxs)(`button`, {
            disabled: !r,
            onClick: () => r && t(`noticeDetail`, r.id),
            children: [
              (0, i.jsx)(`small`, { children: `이전 글` }),
              (0, i.jsx)(`span`, {
                children: r?.title ?? `이전 글이 없습니다.`,
              }),
            ],
          }),
          (0, i.jsxs)(`button`, {
            disabled: !a,
            onClick: () => a && t(`noticeDetail`, a.id),
            children: [
              (0, i.jsx)(`small`, { children: `다음 글` }),
              (0, i.jsx)(`span`, {
                children: a?.title ?? `다음 글이 없습니다.`,
              }),
            ],
          }),
        ],
      }),
      (0, i.jsx)(`div`, {
        className: `notice-detail-actions`,
        children: (0, i.jsx)(`button`, {
          className: `secondary`,
          onClick: () => t(`noticeList`),
          children: `목록으로`,
        }),
      }),
    ],
  });
}
function oe({ initialTab: e, notify: t }) {
  let [n, a] = (0, r.useState)(e);
  return (0, i.jsxs)(`main`, {
    className: `page`,
    children: [
      (0, i.jsx)(PageHeader, {
        kicker: `프로필`,
        title: `프로필 설정`,
        description: `회원정보와 계정 보안 설정을 관리하세요.`,
      }),
      (0, i.jsxs)(`div`, {
        className: `profile-layout`,
        children: [
          (0, i.jsxs)(`aside`, {
            className: `profile-side`,
            children: [
              (0, i.jsx)(`div`, {
                className: `profile-avatar-large`,
                children: `김`,
              }),
              (0, i.jsx)(`h2`, { children: `김지수` }),
              (0, i.jsx)(`p`, { children: `People팀 · 매니저` }),
              (0, i.jsx)(`button`, {
                className: n === `info` ? `active` : ``,
                onClick: () => a(`info`),
                children: `회원정보 수정`,
              }),
              (0, i.jsx)(`button`, {
                className: n === `password` ? `active` : ``,
                onClick: () => a(`password`),
                children: `비밀번호 변경`,
              }),
            ],
          }),
          (0, i.jsx)(`section`, {
            className: `profile-content`,
            children:
              n === `info`
                ? (0, i.jsxs)(i.Fragment, {
                    children: [
                      (0, i.jsxs)(`div`, {
                        className: `profile-section-head`,
                        children: [
                          (0, i.jsx)(`h2`, { children: `회원정보 수정` }),
                          (0, i.jsx)(`p`, {
                            children: `회사에서 사용하는 기본 정보를 확인하고 연락처를 수정할 수 있습니다.`,
                          }),
                        ],
                      }),
                      (0, i.jsxs)(`div`, {
                        className: `profile-form`,
                        children: [
                          (0, i.jsxs)(`label`, {
                            children: [
                              `이름`,
                              (0, i.jsx)(`input`, {
                                value: `김지수`,
                                disabled: !0,
                              }),
                            ],
                          }),
                          (0, i.jsxs)(`label`, {
                            children: [
                              `사번`,
                              (0, i.jsx)(`input`, {
                                value: `SP2024017`,
                                disabled: !0,
                              }),
                            ],
                          }),
                          (0, i.jsxs)(`label`, {
                            children: [
                              `부서`,
                              (0, i.jsx)(`input`, {
                                value: `People팀`,
                                disabled: !0,
                              }),
                            ],
                          }),
                          (0, i.jsxs)(`label`, {
                            children: [
                              `직급`,
                              (0, i.jsx)(`input`, {
                                value: `매니저`,
                                disabled: !0,
                              }),
                            ],
                          }),
                          (0, i.jsxs)(`label`, {
                            className: `full`,
                            children: [
                              `이메일`,
                              (0, i.jsx)(`input`, {
                                defaultValue: `user@company.com`,
                              }),
                            ],
                          }),
                          (0, i.jsxs)(`label`, {
                            className: `full`,
                            children: [
                              `전화번호`,
                              (0, i.jsx)(`input`, {
                                defaultValue: `010-1234-5678`,
                              }),
                            ],
                          }),
                        ],
                      }),
                      (0, i.jsx)(`div`, {
                        className: `profile-actions`,
                        children: (0, i.jsx)(`button`, {
                          className: `primary`,
                          onClick: () => t(`회원정보가 저장되었습니다.`),
                          children: `변경사항 저장`,
                        }),
                      }),
                    ],
                  })
                : (0, i.jsxs)(i.Fragment, {
                    children: [
                      (0, i.jsxs)(`div`, {
                        className: `profile-section-head`,
                        children: [
                          (0, i.jsx)(`h2`, { children: `비밀번호 변경` }),
                          (0, i.jsx)(`p`, {
                            children: `안전한 계정 사용을 위해 주기적으로 비밀번호를 변경해 주세요.`,
                          }),
                        ],
                      }),
                      (0, i.jsxs)(`div`, {
                        className: `password-form`,
                        children: [
                          (0, i.jsxs)(`label`, {
                            children: [
                              `현재 비밀번호`,
                              (0, i.jsx)(`input`, {
                                type: `password`,
                                placeholder: `현재 비밀번호를 입력해 주세요`,
                              }),
                            ],
                          }),
                          (0, i.jsxs)(`label`, {
                            children: [
                              `새 비밀번호`,
                              (0, i.jsx)(`input`, {
                                type: `password`,
                                placeholder: `영문, 숫자 포함 8자 이상`,
                              }),
                            ],
                          }),
                          (0, i.jsxs)(`label`, {
                            children: [
                              `새 비밀번호 확인`,
                              (0, i.jsx)(`input`, {
                                type: `password`,
                                placeholder: `새 비밀번호를 다시 입력해 주세요`,
                              }),
                            ],
                          }),
                        ],
                      }),
                      (0, i.jsxs)(`div`, {
                        className: `password-guide`,
                        children: [
                          (0, i.jsx)(`b`, { children: `비밀번호 설정 안내` }),
                          (0, i.jsx)(`span`, {
                            children: `영문과 숫자를 조합하여 8자 이상 입력해 주세요.`,
                          }),
                          (0, i.jsx)(`span`, {
                            children: `이전에 사용한 비밀번호와 다른 비밀번호를 권장합니다.`,
                          }),
                        ],
                      }),
                      (0, i.jsx)(`div`, {
                        className: `profile-actions`,
                        children: (0, i.jsx)(`button`, {
                          className: `primary`,
                          onClick: () => t(`비밀번호가 변경되었습니다.`),
                          children: `비밀번호 변경`,
                        }),
                      }),
                    ],
                  }),
          }),
        ],
      }),
    ],
  });
}
function se({ role: e, go: t }) {
  return (0, i.jsxs)(`main`, {
    className: `page placeholder`,
    children: [
      (0, i.jsx)(`span`, { children: `◫` }),
      (0, i.jsx)(`h1`, { children: `다음 단계에서 이어서 구현됩니다` }),
      (0, i.jsxs)(`p`, {
        children: [
          `현재 미리보기는 요청하신 1·2단계 핵심 흐름에 집중했습니다.`,
          (0, i.jsx)(`br`, {}),
          `공통 디자인과 내비게이션은 이후 화면에도 동일하게 적용됩니다.`,
        ],
      }),
      (0, i.jsx)(`button`, {
        className: `primary`,
        onClick: () => t(e === `user` ? `userDashboard` : `adminDashboard`),
        children: `대시보드로 돌아가기`,
      }),
    ],
  });
}
function ce() {
  return (0, i.jsxs)(`footer`, {
    children: [
      (0, i.jsx)(P, {}),
      (0, i.jsx)(`span`, {
        children: `고객센터 · 이용약관 · 개인정보처리방침`,
      }),
      (0, i.jsx)(`small`, {
        children: `© 2026 SPARKPLUS. All rights reserved.`,
      }),
    ],
  });
}
export { M as default };
