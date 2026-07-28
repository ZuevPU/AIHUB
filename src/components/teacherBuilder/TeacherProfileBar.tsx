import { cn } from '@/lib/utils';
import { siteUi } from '@/lib/siteUi';
import {
  DEFAULT_TEACHER_PROFILE,
  PROFILE_SELECT_OPTIONS,
  type TeacherProfile,
} from '@/data/teacherBuilder';

interface TeacherProfileBarProps {
  profile: TeacherProfile;
  onChange: (patch: Partial<TeacherProfile>) => void;
}

const FIELD_CLASS = cn(siteUi.input, 'mt-1');

function SelectWithCustom({
  label,
  selectValue,
  customValue,
  options,
  onSelectChange,
  onCustomChange,
  customPlaceholder,
}: {
  label: string;
  selectValue: string;
  customValue: string;
  options: string[];
  onSelectChange: (value: string) => void;
  onCustomChange: (value: string) => void;
  customPlaceholder: string;
}) {
  return (
    <div className="block sm:col-span-2">
      <span className={siteUi.fieldLabel}>{label}</span>
      <div className="mt-1 grid gap-2 sm:grid-cols-2">
        <select value={selectValue} onChange={(e) => onSelectChange(e.target.value)} className={FIELD_CLASS}>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={customValue}
          onChange={(e) => onCustomChange(e.target.value)}
          placeholder={customPlaceholder}
          className={FIELD_CLASS}
        />
      </div>
      <span className="mt-1 block text-xs text-zinc-500">
        Свой вариант справа переопределяет значение из списка.
      </span>
    </div>
  );
}

export function TeacherProfileBar({ profile, onChange }: TeacherProfileBarProps) {
  return (
    <section className="border-b border-zinc-200 bg-zinc-50/80">
      <div className="mx-auto max-w-6xl px-4 py-4 md:px-6">
        <p className="text-sm font-medium text-zinc-900">
          Общий профиль — подставляется во все сущности при переключении
        </p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <label className="block sm:col-span-1">
            <span className={siteUi.fieldLabel}>Предмет</span>
            <input
              type="text"
              value={profile.subject}
              onChange={(e) => onChange({ subject: e.target.value })}
              placeholder={DEFAULT_TEACHER_PROFILE.subject}
              className={FIELD_CLASS}
            />
          </label>
          <label className="block">
            <span className={siteUi.fieldLabel}>Класс</span>
            <select
              value={profile.grade}
              onChange={(e) => onChange({ grade: e.target.value })}
              className={FIELD_CLASS}
            >
              {PROFILE_SELECT_OPTIONS.grade.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </label>
          <label className="block sm:col-span-2 lg:col-span-1">
            <span className={siteUi.fieldLabel}>Тема</span>
            <input
              type="text"
              value={profile.topic}
              onChange={(e) => onChange({ topic: e.target.value })}
              placeholder={DEFAULT_TEACHER_PROFILE.topic}
              className={FIELD_CLASS}
            />
          </label>
          <label className="block">
            <span className={siteUi.fieldLabel}>Место темы в разделе</span>
            <select
              value={profile.topicPlace}
              onChange={(e) => onChange({ topicPlace: e.target.value })}
              className={FIELD_CLASS}
            >
              {PROFILE_SELECT_OPTIONS.topicPlace.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className={siteUi.fieldLabel}>Особенности класса</span>
            <select
              value={profile.classProfile}
              onChange={(e) => onChange({ classProfile: e.target.value })}
              className={FIELD_CLASS}
            >
              {PROFILE_SELECT_OPTIONS.classProfile.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </label>
          <SelectWithCustom
            label="Оснащение"
            selectValue={profile.equipment}
            customValue={profile.equipmentCustom}
            options={PROFILE_SELECT_OPTIONS.equipment}
            onSelectChange={(equipment) => onChange({ equipment })}
            onCustomChange={(equipmentCustom) => onChange({ equipmentCustom })}
            customPlaceholder="Например: интерактивная доска и планшеты на четверых"
          />
          <SelectWithCustom
            label="Роль ИИ в материале"
            selectValue={profile.aiRole}
            customValue={profile.aiRoleCustom}
            options={PROFILE_SELECT_OPTIONS.aiRole}
            onSelectChange={(aiRole) => onChange({ aiRole })}
            onCustomChange={(aiRoleCustom) => onChange({ aiRoleCustom })}
            customPlaceholder="Своя формулировка роли ИИ"
          />
        </div>
      </div>
    </section>
  );
}
