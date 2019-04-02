<?php
defined( '_SHM_ENABLED_' ) or die( 'Restricted access' );

class shTranslator extends Translator {

	private $_data;
	private $_layer;
	private $_fileCount;
	private $_files;
	/**
	 * Get an allocated instance of Text object.
	 * @return Translator
	 */
	public static function getInstance(){
		static $i;
		if(!$i) $i = new Translator();
		return $i;
	}

	/**
	 * Constructor.
	 * @return Translator
	 */
	public function Translator() {
		$this->_data = array();
		$this->_layer = -1;
		$this->_fileCount = 0;
		$this->_files = array();
	}

	/**
	 * Load a language file.
	 * @param $file the language file to load.
	 */
	public function loadLangFile($file){
		array_unshift($this->_files, $file);
		$this->_fileCount++;
		if(!is_file($file)) return false;
		$ini = IniReader::getInstance();
		$ini->setFile($file);
		$this->_data[++$this->_layer] = $ini->hasFile() ? $ini->read() : array();
		if($this->_layer > 0)
			$this->_data[$this->_layer] = array_merge($this->_data[$this->_layer-1], $this->_data[$this->_layer]);
		return true;
	}

	/**
	 * Remove the last language file loaded.
	 */
	public function rmLastFile(){
		array_shift($this->_files);
		$this->_fileCount--;
		if($this->_layer != $this->_fileCount) return;
		if($this->_layer < 0) return;
		unset($this->_data[$this->_layer]);
		$this->_layer--;
	}

	/**
	 * Translate the given string accordint to the languages loaded.
	 * @param String $str the String to translate
	 * @return String translated String.
	 */
	public function translate($str){
		if(isset($this->_data[$this->_layer][$str]))
			return $this->_data[$this->_layer][$str];
		//else if(DEBUG && DEBUG_LANG == Factory::getLang()->getLang())
		//$this->writeToLog($str, Factory::getLang()->getLang());
		return $str;
	}
	/**
	 * Unused function . if the translate function has no translation it fires this err.
	 * Enter description here ...
	 * @param $str
	 * @param $lang
	 */
	private function writeToLog($str, $lang){
		$logFilePath = BASE_PATH . "/../logs/lang/$lang.txt";
		$path = LIVE_PATH . $_SERVER['REQUEST_URI'];
		$lang_file = $this->_files[0];
		$tpl = "word: %s, LANGFILE: $lang_file, PATH: $path";
		if(!file_exists($logFilePath)){
			$h = fopen($logFilePath, "w");
			fputs($h, sprintf($tpl, $str) . "\r\n");
			fclose($h);
			return;
		}
		$folder_create = BASE_PATH . "/../logs/lang" . substr($lang_file, strlen(BASE_PATH), -7);
		if(!file_exists($folder_create))
			mkdir($folder_create, 0777, true) or die(OK);
		$h = fopen($folder_create . "/$lang.ini", "w");
		fputs($h, $str . "=\r\n");
		fclose($h);
		$words = "";
		$h = fopen($logFilePath, "r");
		while(!feof($h))
			$words .= fread($h, 1024);
		fclose($h);
		$words = explode("\r\n", $words);
		foreach ($words as $word){
			if(substr($word, 6, strlen($str)) == $str){
				return;
			}
		}
		$h = fopen($logFilePath, "a");
		fputs($h, sprintf($tpl, $str) . "\r\n");
		fclose($h);
			
	}
}