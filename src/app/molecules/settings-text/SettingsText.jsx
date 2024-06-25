import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

function SettingsText({
  value = '',
  placeHolder = null,
  maxLength = null,
  onChange = null,
  content = null,
  isPassword = false,
  isEmail = false,
}) {
  const inputRef = useRef(null);

  useEffect(() => {
    const inputText = $(inputRef.current);
    const textValidator = (event) => {
      const el = $(event.target);

      const textValue = el.val();
      let tinyValue = '';
      let validated = true;

      if (
        typeof textValue === 'string' &&
        typeof maxLength === 'number' &&
        !Number.isNaN(maxLength) &&
        Number.isFinite(maxLength) &&
        maxLength > -1 &&
        textValue.length > maxLength
      ) {
        tinyValue = textValue.substring(0, maxLength);
        el.val(tinyValue);
      } else if (typeof textValue === 'string') {
        tinyValue = textValue;
      } else {
        validated = false;
      }

      if (validated && event.type === 'change' && onChange) {
        onChange(tinyValue, event.target, el);
      }
    };

    if (inputText.val().length < 1) inputText.val(value);
    inputText.on('change keyup keydown keypress', textValidator);
    return () => {
      inputText.off('change keyup keydown keypress', textValidator);
    };
  });

  return (
    <>
      <input
        ref={inputRef}
        type={!isPassword ? (!isEmail ? 'text' : 'email') : 'password'}
        maxLength={maxLength}
        placeholder={placeHolder}
        className="form-control form-control-bg mt-2 mb-1"
      />
      {content}
    </>
  );
}

SettingsText.propTypes = {
  isEmail: PropTypes.bool,
  isPassword: PropTypes.bool,
  placeHolder: PropTypes.string,
  maxLength: PropTypes.number,
  onChange: PropTypes.func,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  content: PropTypes.node,
};

export default SettingsText;
